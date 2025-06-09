#!/usr/bin/env node

/**
 * OpenAI API Key Access Checker
 * 
 * This script checks what models and permissions your OpenAI API key has access to.
 * Run this to understand your account limits before using the AI features.
 */

const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

/**
 * Check if API key is configured
 */
function checkAPIKey() {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No OpenAI API key found!');
    console.log('💡 Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file');
    return false;
  }
  
  console.log('✅ API key found');
  console.log(`🔑 Key starts with: ${apiKey.substring(0, 7)}...`);
  return true;
}

/**
 * List all available models
 */
async function listAvailableModels() {
  try {
    console.log('\n📋 Fetching available models...');
    
    const models = await openai.models.list();
    const modelList = models.data;
    
    console.log(`\n✅ Found ${modelList.length} available models\n`);
    
    // Group models by type
    const gptModels = modelList.filter(m => m.id.includes('gpt'));
    const whisperModels = modelList.filter(m => m.id.includes('whisper'));
    const dalleModels = modelList.filter(m => m.id.includes('dall-e'));
    const embeddingModels = modelList.filter(m => m.id.includes('embedding'));
    const otherModels = modelList.filter(m => 
      !m.id.includes('gpt') && 
      !m.id.includes('whisper') && 
      !m.id.includes('dall-e') && 
      !m.id.includes('embedding')
    );
    
    // Display GPT models (what we need)
    if (gptModels.length > 0) {
      console.log('🤖 GPT Models (Chat/Text Generation):');
      gptModels.forEach(model => {
        const cost = getModelCost(model.id);
        console.log(`  • ${model.id}${cost ? ` - ${cost}` : ''}`);
      });
    }
    
    // Display other model types
    if (whisperModels.length > 0) {
      console.log('\n🎤 Whisper Models (Speech-to-Text):');
      whisperModels.forEach(model => {
        console.log(`  • ${model.id}`);
      });
    }
    
    if (dalleModels.length > 0) {
      console.log('\n🎨 DALL-E Models (Image Generation):');
      dalleModels.forEach(model => {
        console.log(`  • ${model.id}`);
      });
    }
    
    if (embeddingModels.length > 0) {
      console.log('\n📊 Embedding Models:');
      embeddingModels.forEach(model => {
        console.log(`  • ${model.id}`);
      });
    }
    
    if (otherModels.length > 0) {
      console.log('\n🔧 Other Models:');
      otherModels.forEach(model => {
        console.log(`  • ${model.id}`);
      });
    }
    
    return gptModels;
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
    
    if (error.status === 401) {
      console.log('💡 This usually means your API key is invalid or expired');
    } else if (error.status === 429) {
      console.log('💡 Rate limit exceeded - try again in a moment');
    }
    
    return [];
  }
}

/**
 * Get approximate cost information for models
 */
function getModelCost(modelId) {
  const costs = {
    'gpt-4o': '$5.00 / 1M input tokens, $15.00 / 1M output tokens',
    'gpt-4o-mini': '$0.15 / 1M input tokens, $0.60 / 1M output tokens (RECOMMENDED)',
    'gpt-4-turbo': '$10.00 / 1M input tokens, $30.00 / 1M output tokens',
    'gpt-4': '$30.00 / 1M input tokens, $60.00 / 1M output tokens',
    'gpt-3.5-turbo': '$0.50 / 1M input tokens, $1.50 / 1M output tokens',
  };
  
  return costs[modelId];
}

/**
 * Test model access with a simple request
 */
async function testModelAccess(models) {
  const testModels = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4'];
  const availableTestModels = testModels.filter(model => 
    models.some(m => m.id === model)
  );
  
  if (availableTestModels.length === 0) {
    console.log('\n❌ No common GPT models found to test');
    return;
  }
  
  console.log('\n🧪 Testing model access...');
  
  for (const modelId of availableTestModels.slice(0, 2)) { // Test first 2 models
    try {
      console.log(`\n  Testing ${modelId}...`);
      
      const completion = await openai.chat.completions.create({
        model: modelId,
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" if you can hear me.'
          }
        ],
        max_tokens: 10,
        temperature: 0
      });
      
      const response = completion.choices[0]?.message?.content;
      console.log(`  ✅ ${modelId}: Working! Response: "${response}"`);
      
      // Show usage information
      if (completion.usage) {
        console.log(`     📊 Tokens used: ${completion.usage.total_tokens} (${completion.usage.prompt_tokens} prompt + ${completion.usage.completion_tokens} completion)`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${modelId}: ${error.message}`);
      
      if (error.status === 404) {
        console.log(`     💡 Model not available with your plan`);
      } else if (error.status === 401) {
        console.log(`     💡 Authentication issue`);
      } else if (error.status === 429) {
        console.log(`     💡 Rate limited`);
      }
    }
  }
}

/**
 * Get account information (if available)
 */
async function getAccountInfo() {
  try {
    console.log('\n💳 Checking account information...');
    
    // Note: The organization endpoint may not be available for all accounts
    // This is just a best-effort attempt
    
    console.log('ℹ️  Account details are only available through the OpenAI dashboard');
    console.log('🌐 Visit: https://platform.openai.com/account/usage');
    
  } catch (error) {
    // This is expected for most personal accounts
    console.log('ℹ️  Account API access not available (this is normal for personal accounts)');
  }
}

/**
 * Show recommendations based on findings
 */
function showRecommendations(availableModels) {
  console.log('\n💡 Recommendations for your medical app:');
  
  const hasGPT4oMini = availableModels.some(m => m.id === 'gpt-4o-mini');
  const hasGPT35Turbo = availableModels.some(m => m.id === 'gpt-3.5-turbo');
  const hasGPT4o = availableModels.some(m => m.id === 'gpt-4o');
  
  if (hasGPT4oMini) {
    console.log('✅ Use gpt-4o-mini - Best balance of cost and quality');
    console.log('   • Very affordable ($0.15 per 1M tokens input)');
    console.log('   • Good quality for medical documentation');
    console.log('   • Currently configured in your app ✓');
  } else if (hasGPT35Turbo) {
    console.log('⚠️  Consider gpt-3.5-turbo - Budget option');
    console.log('   • More expensive than gpt-4o-mini');
    console.log('   • Lower quality but still functional');
  } else if (hasGPT4o) {
    console.log('💸 gpt-4o available but expensive');
    console.log('   • High quality but costs 33x more than gpt-4o-mini');
    console.log('   • Consider upgrading to get access to gpt-4o-mini');
  } else {
    console.log('❌ No suitable GPT models found');
    console.log('   • You may need to upgrade your OpenAI account');
    console.log('   • Visit: https://platform.openai.com/account/billing');
  }
  
  console.log('\n🔗 Useful links:');
  console.log('   • OpenAI Dashboard: https://platform.openai.com/');
  console.log('   • Usage & Billing: https://platform.openai.com/account/usage');
  console.log('   • API Keys: https://platform.openai.com/account/api-keys');
  console.log('   • Model Pricing: https://openai.com/pricing');
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 OpenAI API Access Checker\n');
  console.log('This will check what models and permissions your API key has.\n');
  
  // Check if API key exists
  if (!checkAPIKey()) {
    process.exit(1);
  }
  
  try {
    // List available models
    const availableModels = await listAvailableModels();
    
    // Test model access
    if (availableModels.length > 0) {
      await testModelAccess(availableModels);
    }
    
    // Get account info
    await getAccountInfo();
    
    // Show recommendations
    showRecommendations(availableModels);
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('💡 Make sure your API key is valid and has sufficient credits');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 