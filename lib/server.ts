import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import type {Universe,Story,Branch} from './story';
export function db(){if(!env.DB)throw new Error('Storage is temporarily unavailable. Please try again.');return env.DB;}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');if(origin&&origin!==new URL(r.url).origin)throw new Error('Cross-origin request rejected.');if(r.headers.get('sec-fetch-site')==='cross-site')throw new Error('Cross-origin request rejected.');}
export async function guestHash(){const c=(await cookies()).get('elsewhere_guest')?.value;if(!c)return null;return hash(c);}
export async function hash(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function owner(id:string){const u=await getChatGPTUser(),g=await guestHash();const row=await db().prepare('SELECT * FROM universes WHERE id=? AND (expires_at IS NULL OR expires_at>?) AND ((user_id=? AND ? IS NOT NULL) OR (user_id IS NULL AND guest_hash=? AND ? IS NOT NULL))').bind(id,new Date().toISOString(),u?.userId??null,u?.userId??null,g,g).first<any>();return {row,user:u};}
export async function pack(row:any):Promise<Universe>{const {results}=await db().prepare('SELECT * FROM branches WHERE universe_id=? ORDER BY created_at').bind(row.id).all<any>();return {id:row.id,story:JSON.parse(row.story) as Story,branches:results.map(b=>({id:b.id,parentNodeId:b.parent_node_id,choice:b.choice,node:JSON.parse(b.node)})) as Branch[],source:row.source,saved:!!row.saved,shareToken:row.share_token,createdAt:row.created_at};}
export function failure(e:unknown){console.error('Elsewhere request failed',e instanceof Error?e.message:'Unknown error');return json({error:'This part of the universe is unavailable right now. Your answers are still here; please try again.'},503);}
