import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, generateNaturalResponse } = await req.json();
    console.log('Received query:', query, 'Generate natural response:', generateNaturalResponse);

    if (!query) {
      throw new Error('Query is required');
    }

    const dbContext = `
      Tablas disponibles:
      - investors (id SERIAL, name TEXT, nationality TEXT)
      - projects (id SERIAL, name TEXT, description TEXT)
      - investments (id SERIAL, investor_id INT, project_id INT, amount NUMERIC, investment_date DATE)
      
      Reglas:
      - Usa comillas simples para los strings
      - Usa JOIN cuando necesites relacionar tablas
      - Limita los resultados a 100 filas máximo
      - No uses punto y coma al final
      - Usa alias descriptivos para las tablas
      - Asegúrate de que la consulta sea válida y no tenga errores de sintaxis
      - NO uses formato markdown, devuelve solo la consulta SQL plana
    `;

    console.log('Calling OpenAI API for SQL generation...');
    const sqlResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en SQL. Tu tarea es convertir preguntas en lenguaje natural a consultas SQL válidas.
            ${dbContext}
            Responde SOLO con la consulta SQL, sin explicaciones, comentarios ni formato markdown.`
          },
          { role: 'user', content: query }
        ],
        temperature: 0.3,
      }),
    });

    if (!sqlResponse.ok) {
      const error = await sqlResponse.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const sqlData = await sqlResponse.json();
    let sqlQuery = sqlData.choices[0].message.content.trim();
    sqlQuery = sqlQuery.replace(/```sql\n?/g, '').replace(/```/g, '').trim();
    console.log('SQL query:', sqlQuery);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Executing SQL query...');
    const { data: results, error: dbError } = await supabaseClient.rpc('execute_query', {
      query_text: sqlQuery
    });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    let naturalResponse = null;
    if (generateNaturalResponse && results) {
      console.log('Generating natural language response...');
      const naturalResponseData = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres un asistente experto en análisis de datos. Tu tarea es explicar los resultados de una consulta SQL en lenguaje natural, de forma clara y concisa. La explicación debe ser en español y debe incluir los detalles más relevantes de los datos.`
            },
            {
              role: 'user',
              content: `Explica los siguientes resultados de manera natural y concisa: ${JSON.stringify(results)}`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!naturalResponseData.ok) {
        console.error('Error generating natural response:', await naturalResponseData.text());
        throw new Error('Error generating natural response');
      }

      const naturalResponseJson = await naturalResponseData.json();
      naturalResponse = naturalResponseJson.choices[0].message.content;
    }

    console.log('Sending response...');
    return new Response(
      JSON.stringify({ 
        sql: sqlQuery, 
        results: results || [],
        naturalResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in natural-to-sql function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});