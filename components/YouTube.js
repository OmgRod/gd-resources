export default function YouTube({ videoId, title = 'YouTube video', width = '100%', startTime = 0 }) {
  const src = `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;
  
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <iframe
        width={width}
        height="100%"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
