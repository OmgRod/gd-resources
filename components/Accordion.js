import { useState, Children } from 'react';

function Accordion({ items = [], children }) {
  const childArray = Children.toArray(children).filter(Boolean);
  const firstId = items?.[0]?.id || childArray?.[0]?.props?.id;
  const [openId, setOpenId] = useState(firstId);

  const renderHeader = (id, title) => {
    const isOpen = openId === id;
    return (
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <span>{title}</span>
        <span className="text-base">{isOpen ? '−' : '+'}</span>
      </button>
    );
  };

  if ((!items || items.length === 0) && childArray.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
      {childArray.length
        ? childArray.map((child) => {
            const id = child.props?.id;
            const title = child.props?.title;
            const isOpen = openId === id;
            return (
              <div key={id} className="border-b border-slate-200 dark:border-slate-800">
                {renderHeader(id, title)}
                {isOpen ? (
                  <div className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {child.props.children}
                  </div>
                ) : null}
              </div>
            );
          })
        : items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border-b border-slate-200 dark:border-slate-800">
                {renderHeader(item.id, item.title)}
                {isOpen ? (
                  <div className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    {item.children ?? item.content}
                  </div>
                ) : null}
              </div>
            );
          })}
    </div>
  );
}

function AccordionItem() {
  return null;
}

Accordion.Item = AccordionItem;

export default Accordion;
