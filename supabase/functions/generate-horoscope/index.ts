
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
    const { zodiacSign, userProfile, isPersonalized } = await req.json();

    // Handle personalized reading
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const reading = data.choices[0].message.content;

      console.log('Generated personalized reading:', reading);

      return new Response(JSON.stringify({ reading }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle traditional zodiac horoscope
    if (!zodiacSign) {
      return new Response(
        JSON.stringify({ error: 'Zodiac sign is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Generating horoscope for ${zodiacSign}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional astrologer with deep knowledge of astrology and cosmic energies. Create detailed, personalized horoscope readings that are insightful, positive, and meaningful. Your responses should be in JSON format with four sections: general, love, career, and finances. Each section should be 2-3 sentences and feel authentic and mystical.`
          },
          {
            role: 'user',
            content: `Create a detailed horoscope reading for someone with the zodiac sign ${zodiacSign}. Focus on current cosmic energies and planetary influences. Return the response as a JSON object with four keys: "general", "love", "career", and "finances". Each section should be 2-3 sentences long and feel mystical yet practical.`
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const horoscopeText = data.choices[0].message.content;
    
    // Parse the JSON response from ChatGPT
    let horoscope;
    try {
      horoscope = JSON.parse(horoscopeText);
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response as JSON:', parseError);
      // Fallback: create a structured response
      horoscope = {
        general: horoscopeText.substring(0, 200) + "...",
        love: "The cosmic energies are bringing new opportunities for connection and deep emotional experiences.",
        career: "Your professional path is illuminated by positive planetary influences, encouraging growth and success.",
        finances: "Financial wisdom and new opportunities are highlighted by the current celestial movements."
      };
    }

    console.log('Generated horoscope:', horoscope);

    return new Response(JSON.stringify({ horoscope }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
