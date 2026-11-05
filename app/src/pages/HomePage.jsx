import pageMarkup from '../page.html?raw';
import { renderOriginalNode } from '../lib/reactMarkup.jsx';

const sourceDocument = new DOMParser().parseFromString(pageMarkup, 'text/html');
const pageChildren = [...sourceDocument.body.childNodes].map((node, index) => renderOriginalNode(node, index));

export default function HomePage() {
  return <>{pageChildren}</>;
}
