import { retrieveIRCContext } from './ircKnowledgeBase';
import { calculatePanIndiaBOQ, searchPanIndiaLocation } from './panIndiaData';

export interface BOQItem {
  code?: string;
  item: string;
  quantity: string;
  unit: string;
  rateINR: number;
  totalINR: number;
}

export interface BOQResponse {
  summary: string;
  distressAreaSqm: number;
  depthCm: number;
  materials: BOQItem[];
  laborAndEquipment: BOQItem[];
  totalCostINR: number;
  estimatedCO2Kg: number;
  ircCitations: string[];
  executionTimeDays: number;
  source?: 'live' | 'simulated';
  metaCodeAiModel?: string;
  locationName?: string;
  state?: string;
  stateCode?: string;
  cpwdCostIndex?: number;
  terrain?: string;
  terrainMultiplier?: number;
  bitumenGrade?: string;
  pwdScheduleCode?: string;
}

export async function generateBOQWithLlama(
  prompt: string,
  inspectionContext?: any,
  selectedModel: string = 'llama-3.3-70b-versatile'
): Promise<BOQResponse> {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  const ircContext = retrieveIRCContext(prompt + ' ' + (inspectionContext?.distressType || 'pothole'));

  // 1. Dynamic Pan-India Location Resolution
  let targetLocation = inspectionContext?.roadName || 'Delhi (Outer Ring Road)';
  const forMatch = prompt.match(/for\s+([^(,]+)/i);
  if (forMatch && forMatch[1] && forMatch[1].trim().length > 2) {
    targetLocation = forMatch[1].trim();
  } else if (inspectionContext?.location?.address) {
    targetLocation = inspectionContext.location.address;
  }

  // 2. Extract area & depth if specified in prompt
  let area = inspectionContext?.metrics?.areaSqm || 3.5;
  let depth = inspectionContext?.metrics?.maxDepthCm || 15.0;

  const areaMatch = prompt.match(/area[:\s]+([\d.]+)\s*(sqm|m2|m²)?/i);
  if (areaMatch && areaMatch[1]) {
    const parsedArea = parseFloat(areaMatch[1]);
    if (!isNaN(parsedArea) && parsedArea > 0) area = parsedArea;
  }

  const depthMatch = prompt.match(/depth[:\s]+([\d.]+)\s*(cm)?/i);
  if (depthMatch && depthMatch[1]) {
    const parsedDepth = parseFloat(depthMatch[1]);
    if (!isNaN(parsedDepth) && parsedDepth > 0) depth = parsedDepth;
  }

  // 3. Compute baseline Pan-India BOQ using official CPWD State Cost Index & Terrain multipliers
  const panIndiaCalc = calculatePanIndiaBOQ(targetLocation, area, depth);

  if (apiKey) {
    try {
      const isCodeMetaAi = selectedModel.includes('codellama');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: `You are Nirman Copilot, an AI Senior Highway Engineer for India trained on CPWD Delhi Schedule of Rates (DSR), Ministry of Road Transport & Highways (MoRTH), and Indian Road Congress (IRC) standards.
State Context: ${panIndiaCalc.state} (CPWD Cost Index: ${panIndiaCalc.cpwdCostIndex}%, Terrain: ${panIndiaCalc.terrain}, Bitumen: ${panIndiaCalc.bitumenGrade}).
Grounded in IRC standards:
${ircContext}

Return structured JSON conforming to this schema:
{
  "summary": "technical rationale explaining repair layers",
  "distressAreaSqm": number,
  "depthCm": number,
  "materials": [{"code": "string", "item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "laborAndEquipment": [{"code": "string", "item": "string", "quantity": "string", "unit": "string", "rateINR": number, "totalINR": number}],
  "totalCostINR": number,
  "estimatedCO2Kg": number,
  "ircCitations": ["string"],
  "executionTimeDays": number
}`,
            },
            {
              role: 'user',
              content: `User prompt: ${prompt}\nLocation: ${panIndiaCalc.location}\nArea: ${area} sqm, Depth: ${depth} cm`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as BOQResponse;
          parsed.source = 'live';
          parsed.metaCodeAiModel = selectedModel;
          parsed.locationName = panIndiaCalc.location;
          parsed.state = panIndiaCalc.state;
          parsed.stateCode = panIndiaCalc.stateCode;
          parsed.cpwdCostIndex = panIndiaCalc.cpwdCostIndex;
          parsed.terrain = panIndiaCalc.terrain;
          parsed.terrainMultiplier = panIndiaCalc.terrainMultiplier;
          parsed.bitumenGrade = panIndiaCalc.bitumenGrade;
          parsed.pwdScheduleCode = panIndiaCalc.pwdScheduleCode;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Groq API call fallback triggered:', err);
    }
  }

  // Fallback to Pan-India Grounded Calculation Engine
  return {
    summary: panIndiaCalc.summary,
    distressAreaSqm: panIndiaCalc.distressAreaSqm,
    depthCm: panIndiaCalc.depthCm,
    materials: panIndiaCalc.materials,
    laborAndEquipment: panIndiaCalc.laborAndEquipment,
    totalCostINR: panIndiaCalc.totalCostINR,
    estimatedCO2Kg: panIndiaCalc.estimatedCO2Kg,
    ircCitations: panIndiaCalc.ircCitations,
    executionTimeDays: panIndiaCalc.executionTimeDays,
    source: 'simulated',
    metaCodeAiModel: selectedModel,
    locationName: panIndiaCalc.location,
    state: panIndiaCalc.state,
    stateCode: panIndiaCalc.stateCode,
    cpwdCostIndex: panIndiaCalc.cpwdCostIndex,
    terrain: panIndiaCalc.terrain,
    terrainMultiplier: panIndiaCalc.terrainMultiplier,
    bitumenGrade: panIndiaCalc.bitumenGrade,
    pwdScheduleCode: panIndiaCalc.pwdScheduleCode,
  };
}
