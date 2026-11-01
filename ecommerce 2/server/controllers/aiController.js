import { db } from '../database/db.js';

export const askNexaAI = async (req, res, next) => {
  try {
    const { prompt, budget, category } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required for Nexa AI recommendation engine.'
      });
    }

    const query = prompt.toLowerCase();
    const allProducts = await db.getProducts();

    // Semantic keyword analysis & scoring
    const scoredProducts = allProducts.map(p => {
      let score = 0;
      const combinedText = `${p.name} ${p.description} ${p.category_name} ${JSON.stringify(p.features || {})}`.toLowerCase();

      // Check query tokens
      const tokens = query.split(/\s+/).filter(t => t.length > 2);
      for (const token of tokens) {
        if (p.name.toLowerCase().includes(token)) score += 10;
        if (p.category_name.toLowerCase().includes(token)) score += 8;
        if (p.description.toLowerCase().includes(token)) score += 4;
      }

      // Semantic domain boosts
      if ((query.includes('llm') || query.includes('inference') || query.includes('processor') || query.includes('chip') || query.includes('tpu') || query.includes('npu')) && p.category_id === 1) {
        score += 15;
      }
      if ((query.includes('drone') || query.includes('robot') || query.includes('arm') || query.includes('autonomous')) && p.category_id === 2) {
        score += 15;
      }
      if ((query.includes('focus') || query.includes('brain') || query.includes('wearable') || query.includes('glasses') || query.includes('ar') || query.includes('eeg')) && p.category_id === 3) {
        score += 15;
      }
      if ((query.includes('hologram') || query.includes('3d') || query.includes('display') || query.includes('lidar') || query.includes('spatial')) && p.category_id === 4) {
        score += 15;
      }
      if ((query.includes('home') || query.includes('hub') || query.includes('local') || query.includes('private') || query.includes('voice')) && p.category_id === 5) {
        score += 15;
      }

      // Budget preference
      if (budget && p.price <= parseFloat(budget)) {
        score += 5;
      }

      return {
        product: p,
        score
      };
    });

    // Sort by score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Pick top 3 matches
    const topMatches = scoredProducts.filter(item => item.score > 0).slice(0, 3);
    const results = topMatches.length > 0 ? topMatches.map(m => m.product) : allProducts.slice(0, 3);

    // Generate intelligent AI response message
    let responseSummary = '';
    if (results.length > 0) {
      const p1 = results[0];
      responseSummary = `Based on your request "${prompt}", I analyzed our neural hardware architecture and found that the ${p1.name} (₹${Number(p1.price).toLocaleString('en-IN')}) offers the optimal compute profile and latency characteristics for your requirements.`;
    } else {
      responseSummary = `I analyzed our quantum & neural inventory and highlighted our flagship systems engineered for high-performance workloads.`;
    }

    return res.json({
      success: true,
      query: prompt,
      aiSummary: responseSummary,
      recommendedProducts: results
    });
  } catch (err) {
    next(err);
  }
};

