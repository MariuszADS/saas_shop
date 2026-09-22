import {pool} from "@/db/db.ts"

export async function deleteProduct(id:number) {
 const result = await pool.query(
    `
    DELETE FROM products
    WHERE id = $1
    RETURNING *
    `,
    [id]
 )
 return result.rows[0]
}