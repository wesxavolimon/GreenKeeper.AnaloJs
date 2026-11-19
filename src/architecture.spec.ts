const rawModules = import.meta.glob('./**/*.ts', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function getLayerSources(prefix: string): [string, string][] {
  return Object.entries(rawModules).filter(
    ([path]) => path.startsWith(prefix) && !path.endsWith('.spec.ts'),
  );
}

describe('Clean Architecture Boundaries', () => {
  it('keeps domain layer free from Angular, AnalogJS, Application, Infrastructure, Composition, and App imports', () => {
    const domainFiles = getLayerSources('./domain/');
    expect(domainFiles.length).toBeGreaterThan(0);

    for (const [, content] of domainFiles) {
      expect(content).not.toMatch(/@angular\//);
      expect(content).not.toMatch(/@analogjs\//);
      expect(content).not.toMatch(/@application\//);
      expect(content).not.toMatch(/@infrastructure\//);
      expect(content).not.toMatch(/@composition\//);
      expect(content).not.toMatch(/@app\//);
    }
  });

  it('keeps application layer free from Angular, AnalogJS, Infrastructure, Composition, and App imports', () => {
    const appFiles = getLayerSources('./application/');
    expect(appFiles.length).toBeGreaterThan(0);

    for (const [, content] of appFiles) {
      expect(content).not.toMatch(/@angular\//);
      expect(content).not.toMatch(/@analogjs\//);
      expect(content).not.toMatch(/@infrastructure\//);
      expect(content).not.toMatch(/@composition\//);
      expect(content).not.toMatch(/@app\//);
    }
  });

  it('prevents UI layer (src/app) from importing directly from src/infrastructure', () => {
    const uiFiles = getLayerSources('./app/');
    expect(uiFiles.length).toBeGreaterThan(0);

    for (const [, content] of uiFiles) {
      expect(content).not.toMatch(/@infrastructure\//);
      expect(content).not.toMatch(/\.\.\/infrastructure/);
    }
  });
});
