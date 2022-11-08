\c questionsanswers
\timing


-- get /qa/questions
SELECT
    json_build_object(
      'product_id', 1000000,
      'results', (SELECT json_agg(
        json_build_object(
          'question_id', question_id,
          'question_body', question_body,
          'question_date', question_date,
          'asker_name', asker_name,
          'question_helpfulness', question_helpfulness,
          'reported', reported,
          'answers', (SELECT json_object_agg(
            id, json_build_object(
              'id', id,
              'body', answer_body,
              'date', date_written,
              'answerer_name', answerer_name,
              'helpfulness', answer_helpfulness,
              'photos', (SELECT COALESCE(json_agg(answers_photos.url), '[]'::json) FROM answers_photos WHERE answer_id = answers.id)
            )
          ) FROM answers WHERE question_id = questions.question_id)
        )
      ) FROM questions WHERE product_id = 1000000 AND reported = false)
    );

-- get /qa/questions/:question_id/answers'
SELECT json_build_object(
  'question', 1,
  'page', 0,
  'count', 5,
  'results', (SELECT json_agg(json_build_object(
    'answer_id', id,
    'body', answer_body,
    'date', date_written,
    'answerer_name', answerer_name,
    'helpfulness', answer_helpfulness,
    'photos', (SELECT COALESCE (json_agg(json_build_object(
      'id', id,
      'url', url
    )), '[]'::json) FROM answers_photos WHERE answer_id = answers.id)
    )) FROM answers WHERE question_id = 1 AND reported = false)
);


\timing