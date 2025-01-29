interface HeroProps {
  mode: 'share' | 'receive';
}

export function Hero({ mode }: HeroProps) {
  const content = {
    share: {
      title: 'Secure File Sharing Made Simple',
      description: 'Share files instantly with your peers.',
    },
    receive: {
      title: 'Receive Files Instantly',
      description: 'Receive files from your peers with ease.',
    },
  };
  return (
    <section className="text-center max-w-3xl mx-auto mb-16 space-y-6">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        {content[mode].title}
      </h2>
      <p className="text-lg text-muted-foreground">
        {content[mode].description}
      </p>
    </section>
  );
}
