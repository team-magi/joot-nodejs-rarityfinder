var { pool } = require('../config/database');

(async () => {
    let sql = `
    SELECT
     tokenId,
     rarity_score,
     @prev := @curr as prev,
     @curr := rarity_score as curr,
     @rank := IF(@prev> @curr, @rank+@ties, @rank) AS rank,
     @ties := IF(@prev = @curr, @ties+1, 1) AS ties,
     (1-@rank/@total) as percentrank
    FROM
     loot,
     (SELECT
     @curr := null,
     @prev := null,
     @rank := 0,
     @ties := 1,
     @total := count(*) from loot where rarity_score is not null
     ) b
    WHERE
     rarity_score is not null
    ORDER BY
     rarity_score DESC
    `;
    let [rows] = await pool.query(sql);
    for (let temp of rows) {
        let data = {
            percentile: temp.percentrank
        };
        sql = `UPDATE loot set ? where tokenId = ${temp.tokenId}`;
        await pool.query(sql, data);
    }
    pool.end();
})();
