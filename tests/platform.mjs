import { DatabaseSync } from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');
for(const f of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('drizzle/'+f,'utf8'));
class Query{constructor(q,args=[]){this.q=q;this.args=args}bind(...args){return new Query(this.q,args)}async first(){return sql.prepare(this.q).get(...this.args)??null}async all(){return {results:sql.prepare(this.q).all(...this.args)}}async run(){return sql.prepare(this.q).run(...this.args)}}
export const env={DB:{prepare:q=>new Query(q),batch:async qs=>{sql.exec('BEGIN');try{const result=[];for(const q of qs)result.push(await q.run());sql.exec('COMMIT');return result}catch(e){sql.exec('ROLLBACK');throw e}}}};
let current=new Request('https://elsewhere.test/');let jar=new Map();
export function requestState(r,cookies=new Map()){current=r;jar=cookies}
export async function headers(){return current.headers}
export async function cookies(){return {get:k=>jar.has(k)?{value:jar.get(k)}:undefined,set:(k,v)=>jar.set(k,v)}}
export {sql};
