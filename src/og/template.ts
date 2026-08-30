// Satori VDOM template for the social-card images.
// Plain objects instead of JSX so no React dependency is needed.

export type OgKind = 'blog' | 'note' | 'project';

export interface OgProps {
  title: string;
  description?: string;
  kind: OgKind;
}

const ACCENTS: Record<OgKind, { color: string; label: string }> = {
  blog: { color: '#a07520', label: 'Blog' },
  note: { color: '#2e8045', label: 'Note' },
  project: { color: '#2a6298', label: 'Project' },
};

type VNode = { type: string; props: Record<string, unknown> };

export function ogTemplate({ title, description, kind }: OgProps): VNode {
  const accent = ACCENTS[kind];

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#faf9f5',
      },
      children: [
        // Accent bar in the content-type color
        {
          type: 'div',
          props: {
            style: { width: '16px', height: '100%', backgroundColor: accent.color },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              padding: '72px 80px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'DM Sans',
                          fontWeight: 700,
                          fontSize: '28px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: accent.color,
                        },
                        children: accent.label,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'DM Sans',
                          fontWeight: 700,
                          fontSize: '64px',
                          lineHeight: 1.15,
                          color: '#1f1e1a',
                          marginTop: '24px',
                          lineClamp: 3,
                        },
                        children: title,
                      },
                    },
                    ...(description
                      ? [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontFamily: 'Crimson Pro',
                                fontSize: '32px',
                                lineHeight: 1.4,
                                color: '#5e5950',
                                marginTop: '28px',
                                lineClamp: 3,
                              },
                              children: description,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'DM Sans',
                          fontWeight: 700,
                          fontSize: '30px',
                          color: '#1f1e1a',
                        },
                        children: 'Anchit Verma',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Crimson Pro',
                          fontSize: '28px',
                          color: '#5e5950',
                        },
                        children: 'anchitverma.com',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
