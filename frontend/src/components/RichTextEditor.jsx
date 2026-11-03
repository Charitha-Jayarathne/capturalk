import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  Quote, 
  List, 
  ListOrdered, 
  Sparkles, 
  Eye, 
  Code2, 
  AlignLeft,
  RotateCcw
} from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = 'Write your editorial narrative here...' }) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const textareaRef = useRef(null);

  // Helper to wrap selected text or insert tags at cursor
  const insertTag = (openTag, closeTag, defaultText = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const selectedText = currentVal.substring(start, end) || defaultText;

    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    onChange(newVal);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertTag('<strong>', '</strong>', 'bold text');
  const handleItalic = () => insertTag('<em>', '</em>', 'italicized phrase');
  const handleH2 = () => insertTag('<h3>', '</h3>', 'Section Subheading');
  const handleQuote = () => insertTag('<blockquote class="border-l-2 border-[#ff6a13] pl-4 italic text-neutral-300 my-3">', '</blockquote>', 'A quiet moment of sacred beauty.');
  const handleAccent = () => insertTag('<span style="color: #ff6a13; font-weight: 500;">', '</span>', 'Captura LK');
  const handleParagraph = () => insertTag('<p>', '</p>', 'New paragraph narrative goes here.');
  const handleBulletList = () => {
    const listHtml = '\n<ul style="list-style-type: disc; padding-left: 20px; margin: 8px 0;">\n  <li>Curated intimate moments</li>\n  <li>Cinematic fine-art grading</li>\n</ul>\n';
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const newVal = currentVal.substring(0, start) + listHtml + currentVal.substring(end);
    onChange(newVal);
  };

  const handleNumberedList = () => {
    const listHtml = '\n<ol style="list-style-type: decimal; padding-left: 20px; margin: 8px 0;">\n  <li>Initial Creative Consultation</li>\n  <li>Master Capture & Direction</li>\n  <li>Fine-Art Archival Delivery</li>\n</ol>\n';
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const newVal = currentVal.substring(0, start) + listHtml + currentVal.substring(end);
    onChange(newVal);
  };

  const wordCount = (value || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ border: '1px solid #262638', borderRadius: '6px', backgroundColor: '#0d0d14', overflow: 'hidden' }}>
      {/* Top Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#13131e', borderBottom: '1px solid #1f1f2e', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleBold}
            title="Bold (Strong)"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 600 }}
          >
            <Bold style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleItalic}
            title="Italic (Emphasis)"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <Italic style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleH2}
            title="Subheading (H3)"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <Heading3 style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleParagraph}
            title="Wrap in Paragraph <p>"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <AlignLeft style={{ width: '13px', height: '13px' }} />
            <span style={{ marginLeft: '4px', fontSize: '10px' }}>&lt;p&gt;</span>
          </button>

          <button
            type="button"
            onClick={handleQuote}
            title="Callout Blockquote"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <Quote style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleBulletList}
            title="Bullet List"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <List style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleNumberedList}
            title="Numbered List"
            style={{ padding: '5px 8px', background: '#1c1c2b', border: '1px solid #2e2e42', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' }}
          >
            <ListOrdered style={{ width: '13px', height: '13px' }} />
          </button>

          <button
            type="button"
            onClick={handleAccent}
            title="Orange Highlight"
            style={{ padding: '5px 8px', background: '#201815', border: '1px solid #ff6a13', borderRadius: '4px', color: '#ff6a13', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 600 }}
          >
            <Sparkles style={{ width: '12px', height: '12px', marginRight: '4px' }} />
            <span>Accent</span>
          </button>
        </div>

        {/* Tab Switcher: Edit vs Live Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#09090f', padding: '2px', borderRadius: '4px', border: '1px solid #1c1c2b' }}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'write' ? '#ff6a13' : 'transparent',
              color: activeTab === 'write' ? '#fff' : '#888899',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Code2 style={{ width: '12px', height: '12px' }} />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'preview' ? '#ff6a13' : 'transparent',
              color: activeTab === 'preview' ? '#fff' : '#888899',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye style={{ width: '12px', height: '12px' }} />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={7}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: '#0a0a10',
            color: '#e4e4ee',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            lineHeight: '1.65',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '140px'
          }}
        />
      ) : (
        <div 
          style={{
            padding: '18px 20px',
            minHeight: '140px',
            backgroundColor: '#07070b',
            color: '#d1d1de',
            fontSize: '14px',
            lineHeight: '1.75'
          }}
          className="about-preview-content"
          dangerouslySetInnerHTML={{ __html: value || '<p style="color: #666; font-style: italic;">No narrative content entered yet. Switch to Editor to write.</p>' }}
        />
      )}

      {/* Footer Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#09090f', borderTop: '1px solid #191924', fontSize: '11px', color: '#66667a', fontFamily: 'monospace' }}>
        <span>HTML & Rich Formatted Narrative</span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}
