import Explorer from '../../explorer';
export const dynamic='force-dynamic';
export default async function UniversePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Explorer id={id}/>}
