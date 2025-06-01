
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate horoscope function started');
    
    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('OpenAI API key found, length:', openAIApiKey.length);

    const { userProfile, isPersonalized } = await req.json();
    console.log('Request data:', { userProfile, isPersonalized });

    // Handle personalized reading only
    if (isPersonalized && userProfile) {
      console.log(`Generating personalized reading for ${userProfile.fullName}`);

      const personalizedPrompt = `You are a renowned tarot reader, spiritual guide, and manifestation coach with deep knowledge of both Western and esoteric traditions.  
Your style is empathetic, practical, insightful, and always tailored to the individual.

A client has provided their full name, exact date of birth, and place of birth:  
- Name: ${userProfile.fullName}  
- Date of birth: ${userProfile.birthDate}  
- Place of birth: ${userProfile.birthPlace}  

Please generate a comprehensive and unique reading that feels personal and meaningful.  
Your reading should include:

1. **Short Introduction:**  
   Welcome the client, briefly acknowledge their details, and create a warm, encouraging atmosphere.

2. **Personal Situation Insight:**  
   Give an analysis of what their birth data might reveal about their current life themes, challenges, and hidden strengths (you may refer to general archetypes, but make it feel specific and tailored).

3. **Short-term Outlook:**  
   Provide a short-term forecast for the next 1–3 months, focusing on practical opportunities, personal growth, and potential obstacles.

4. **Actionable Ritual or Mantra:**  
   Suggest a simple Wicca-inspired ritual or a powerful manifestation mantra that the client can use to influence their situation for the better.  
   Give clear, practical instructions that are easy to follow at home.

5. **Motivational Closing:**  
   End with a positive, empowering message, reinforcing that the client has real influence over their path, and encourage them to take action.

**Important:**  
- Make the reading at least 400–500 words.  
- Be gentle, encouraging, and never fatalistic.  
- Avoid medical, legal, or financial advice.
- The tone should feel wise, non-judgmental, and inspiring.

Begin the reading now, using the client's provided details. Make the message feel truly unique and personal.`;

      console.log('Making OpenAI API request for personalized reading');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: personalizedPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      console.log('OpenAI API response status:', response.status);
      console.log('OpenAI API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} - ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI API response data keys:', Object.keys(data));
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected OpenAI API response structure:', data);
        throw new Error('Unexpected response structure from OpenAI API');
      }
      
      const reading = data.choices[0].message.content;
      console.log('Generated personalized reading length:', reading?.length);

      return new Response(JSON.stringify({ reading }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If not a personalized reading request, return error
    return new Response(
      JSON.stringify({ error: 'Only personalized readings are supported' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-horoscope function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
