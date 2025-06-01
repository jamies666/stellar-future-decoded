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

    const { userProfile, isPersonalized, isTarot, isNumerology, tarotTheme, tarotQuestion } = await req.json();
    console.log('Request data:', { userProfile, isPersonalized, isTarot, isNumerology, tarotTheme, tarotQuestion });

    // Handle numerology reading
    if (isNumerology && userProfile) {
      console.log(`Generating numerology reading for ${userProfile.fullName}`);

      const numerologyPrompt = `You are an expert numerologist, skilled in interpreting the meaning and influence of numbers in a person's life.  
The client below has provided their date of birth ${userProfile.birthDate} and their full name ${userProfile.fullName}.

Please generate a comprehensive, unique numerology reading that is personal, easy to understand, and insightful.  
Include the following in your response:

1. **Brief Introduction:**  
   Welcome the client, mention their provided birth date and name, and explain what numerology is in a warm, engaging way.

2. **Life Path Number:**  
   - Calculate and explain their Life Path Number (based on the sum of the date of birth).
   - Describe the personality traits, strengths, and potential challenges associated with this number.
   - Make it specific to the client's journey.

3. **Other Relevant Numbers:**  
   Calculate the Destiny/Expression Number based on their full name, and briefly explain what this reveals about the client.

4. **Practical Advice:**  
   Give one or two actionable suggestions or affirmations tailored to their numerological profile, helping them harness their strengths and grow.

5. **Motivational Closing:**  
   End with a positive, empowering message that encourages the client to embrace their numerological path.

**Important:**  
- Explain calculations in a simple way, but focus more on meaning and practical insight than on math.
- Be gentle, uplifting, and supportive in tone.
- Do not give medical, legal, or financial advice.

Begin the numerology reading now using the client's details. Make the response at least 300–400 words and unique for each client.`;

      console.log('Making OpenAI API request for numerology reading');
      
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
              content: numerologyPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      console.log('OpenAI API response status:', response.status);

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
      console.log('Generated numerology reading length:', reading?.length);

      return new Response(JSON.stringify({ reading }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle tarot reading
    if (isTarot && userProfile) {
      console.log(`Generating tarot reading for ${userProfile.fullName} with theme: ${tarotTheme}`);

      const tarotPrompt = `You are a seasoned tarot expert and spiritual coach, famous for your detailed, insightful, and compassionate readings.  
The client below is seeking a three-card tarot reading focused on a specific area of life.  
Please draw and interpret three tarot cards, adapting your reading to the client's chosen theme.

Client's details:  
- Name: ${userProfile.fullName}
- Birthdate: ${userProfile.birthDate}
- Chosen theme: ${tarotTheme}
${tarotQuestion ? `- Question: ${tarotQuestion}` : ''}

**Your task:**
1. Begin with a short, warm welcome and introduction, tailored to the client's name and chosen theme.  
2. Clearly draw three tarot cards for the client, one by one:  
   - Card 1: The Present Situation  
   - Card 2: The Challenge/Obstacle  
   - Card 3: The Likely Outcome/Advice  
3. For each card:  
   - Name the card (choose from standard tarot deck: e.g. The Fool, The Lovers, The Tower, etc.)
   - Describe the traditional meaning of the card.
   - Give a personal interpretation based on the client's details and their chosen theme.
4. After interpreting all three cards, give a summary focused on:  
   - What the cards collectively say about the client's situation in their chosen theme.
   - Gentle, practical advice for next steps, including a positive affirmation or short action the client can take in this area of life.
5. Finish with an encouraging, motivational closing that reassures the client and invites them to reflect or take action.

**Important style notes:**  
- Be positive, honest, and non-fatalistic.
- Write at least 400–500 words.
- Make the reading unique and engaging.
- Do not give medical or financial advice; keep advice general and supportive.

**Begin the reading now, using the client's details.**`;

      console.log('Making OpenAI API request for tarot reading');
      
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
              content: tarotPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      console.log('OpenAI API response status:', response.status);

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
      console.log('Generated tarot reading length:', reading?.length);

      return new Response(JSON.stringify({ reading }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // If not a valid reading request, return error
    return new Response(
      JSON.stringify({ error: 'Invalid reading request' }),
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
