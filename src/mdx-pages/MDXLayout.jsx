export default function MDXLayout({ children }) {
  return (
    <div className="p-4 px-8 md:p-8">
      {/* <HeaderNav /> */}
      <main className="max-w-2xl mx-auto">
        <article className="prose md:prose-lg lg:prose-xl">{children}</article>
      </main>
      {/* <FooterNav /> */}
    </div>
  );
}
