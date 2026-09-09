import Explorer from '../../explorer';
export const dynamic='force-dynamic';
export const metadata={title:'A life elsewhere — Shared fiction',description:'An imaginative alternate life shared by its creator.',robots:{index:false,follow:false}};
export default async function SharePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Explorer id={id} readOnly/>}
