CREATE OR REPLACE FUNCTION execute_query(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT jsonb_agg(row_to_json(t))
          FROM (
            SELECT *
            FROM json_to_recordset(
              (SELECT json_agg(row_to_json(t))
               FROM (
                 EXECUTE query_text
               ) t
              )
            ) AS t
          ) t
         );
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error executing query: %', SQLERRM;
END;
$$;