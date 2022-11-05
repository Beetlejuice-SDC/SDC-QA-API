const db = require('../database/postgres.js');

module.exports = {
  getAll: async (productId, page, count) => {
    const queryStr = `SELECT
    json_build_object(
      'product_id', ${productId},
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
              'body', body,
              'date', date_written,
              'answerer_name', answerer_name,
              'helpfulness', helpfulness,
              'photos', (SELECT COALESCE(json_agg(answers_photos.url), '[]'::json) FROM answers_photos WHERE answer_id = answers.id)
            )
          ) FROM answers WHERE question_id = questions.question_id)
        )
      ) FROM questions WHERE product_id = ${productId} AND reported = false LIMIT ${count} OFFSET ${(page - 1) * count})
    )`;
    const getQuestions = await db.query(queryStr);
    return getQuestions;
  },
  post: async (params) => {
    const queryStr = `INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, question_helpfulness)
    VALUES($1, $2, to_timestamp(${Date.now() / 1000}), $3, $4, $5);
    `;
    const addQuestion = await db.query(queryStr, params);
    return addQuestion;
  },
  putHelpfulness: async (questionId) => {
    const queryStr = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${questionId}`;
    const incrementHelpful = await db.query(queryStr);
    return incrementHelpful;
  },
  putReported: async (questionId) => {
    const queryStr = `UPDATE questions SET reported = true WHERE question_id = ${questionId}`;
    const reportQuestion = await db.query(queryStr);
    return reportQuestion;
  }
};