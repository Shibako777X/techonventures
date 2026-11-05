import React from 'react';
import {
  ArrowRight, Building2, Check, Clock, Copy, Facebook, Filter, Gauge, GraduationCap,
  Hammer, Handshake, Headphones, Hexagon, Infinity as InfinityIcon, Instagram, Layers,
  Leaf, Linkedin, ListChecks, Map as MapIcon, MapPin, Monitor, Mountain, PencilRuler,
  Play, Presentation, RefreshCw, Rocket, ScanSearch, Smile, Sparkle, Sparkles, Tag,
  Target, TrendingUp, Users, X, Zap,
} from 'lucide-react';

const iconComponents = {
  'arrow-right': ArrowRight, 'building-2': Building2, check: Check, clock: Clock,
  copy: Copy, facebook: Facebook, filter: Filter, gauge: Gauge, 'graduation-cap': GraduationCap,
  hammer: Hammer, handshake: Handshake, headphones: Headphones, hexagon: Hexagon,
  infinity: InfinityIcon, instagram: Instagram, layers: Layers, leaf: Leaf, linkedin: Linkedin,
  'list-checks': ListChecks, map: MapIcon, 'map-pin': MapPin, monitor: Monitor, mountain: Mountain,
  'pencil-ruler': PencilRuler, play: Play, presentation: Presentation, 'refresh-cw': RefreshCw,
  rocket: Rocket, 'scan-search': ScanSearch, smile: Smile, sparkle: Sparkle, sparkles: Sparkles,
  tag: Tag, target: Target, 'trending-up': TrendingUp, users: Users, x: X, zap: Zap,
};

const attributeNames = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly',
  colspan: 'colSpan', rowspan: 'rowSpan', maxlength: 'maxLength', minlength: 'minLength',
  novalidate: 'noValidate', 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule',
  'fill-opacity': 'fillOpacity', 'stroke-opacity': 'strokeOpacity', 'xlink:href': 'xlinkHref',
};

function toStyle(value) {
  return Object.fromEntries(value.split(';').map((declaration) => declaration.trim()).filter(Boolean).map((declaration) => {
    const separator = declaration.indexOf(':');
    const property = declaration.slice(0, separator).trim();
    const rawValue = declaration.slice(separator + 1).trim();
    const key = property.startsWith('--') ? property : property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return [key, rawValue];
  }));
}

export function renderOriginalNode(node, key) {
  if (node.nodeType === 3) return node.nodeValue;
  if (node.nodeType !== 1) return null;
  if (node.hasAttribute('data-lucide')) {
    const iconName = node.getAttribute('data-lucide');
    const Icon = iconComponents[iconName];
    if (Icon) return <Icon key={key} className={`lucide lucide-${iconName}`} />;
  }
  const props = { key };
  for (const attribute of node.attributes) {
    const name = attributeNames[attribute.name] || attribute.name;
    let value = attribute.value;
    if (attribute.name === 'style') value = toStyle(value);
    else if (['checked', 'selected', 'disabled', 'required', 'multiple', 'autofocus', 'novalidate', 'readonly'].includes(attribute.name)) value = true;
    props[name] = value;
  }
  const children = [...node.childNodes].map((child, index) => child.nodeType === 1 && child.tagName.toLowerCase() === 'section'
    ? <OriginalSection key={index} node={child} />
    : renderOriginalNode(child, index));
  return React.createElement(node.tagName.toLowerCase(), props, ...children);
}

function OriginalSection({ node }) {
  return renderOriginalNode(node);
}
