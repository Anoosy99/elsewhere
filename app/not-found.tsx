import Link from 'next/link';import {Header,Stars} from './shell';
export default function NotFound(){return <div className="page-wrap"><Stars/><Header/><main className="page-content empty"><h1>This path hasn’t been written.</h1><p>The page you’re looking for isn’t here.</p><Link className="primary" href="/">Return to the observatory</Link></main></div>}
