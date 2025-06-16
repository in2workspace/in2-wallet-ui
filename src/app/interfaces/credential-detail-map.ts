export interface DetailField {
  label: string;
  valueGetter: (subject: any, vc: any) => string;
}

export interface DetailSection {
  section: string;
  fields: DetailField[];
}

export const CredentialDetailMap: Record<string, DetailSection[]> = {
  LEARCredentialEmployee: [
    {
      section: 'Mandatee',
      fields: [
        { label: 'First Name', valueGetter: (s) => s.mandate?.mandatee?.firstName ?? '' },
        { label: 'Last Name', valueGetter: (s) => s.mandate?.mandatee?.lastName ?? '' },
        { label: 'Email', valueGetter: (s) => s.mandate?.mandatee?.email ?? '' },
        { label: 'Nationality', valueGetter: (s) => s.mandate?.mandatee?.nationality ?? '' },
      ],
    },
    {
      section: 'Mandator',
      fields: [
        { label: 'Organization', valueGetter: (s) => s.mandate?.mandator?.organization ?? '' },
        { label: 'Common Name', valueGetter: (s) => s.mandate?.mandator?.commonName ?? '' },
        { label: 'Serial Number', valueGetter: (s) => s.mandate?.mandator?.serialNumber ?? '' },
        { label: 'Country', valueGetter: (s) => s.mandate?.mandator?.country ?? '' },
        { label: 'Email Address', valueGetter: (s) => s.mandate?.mandator?.emailAddress ?? '' },
        { label: 'Identifier', valueGetter: (s) => s.mandate?.mandator?.organizationIdentifier ?? '' },
      ],
    },
    {
      section: 'Powers',
      fields: [
        {
          label: 'Powers',
          valueGetter: (s) =>
            (s.mandate?.power ?? [])
              .map((p: any, i: number) =>
                `#${i + 1}: ${p.function} (${p.domain}) → ${Array.isArray(p.action) ? p.action.join(', ') : p.action}`
              )
              .join('\n'),
        },
      ],
    },
  ],

  LEARCredentialMachine: [
    {
      section: 'Machine Info',
      fields: [
        { label: 'IP Address', valueGetter: (s) => s.mandate?.mandatee?.ipAddress ?? '' },
        { label: 'Domain', valueGetter: (s) => s.mandate?.mandatee?.domain ?? '' },
        { label: 'ID', valueGetter: (s) => s.mandate?.mandatee?.id ?? '' },
      ],
    },
    {
      section: 'Mandator',
      fields: [
        { label: 'Organization', valueGetter: (s) => s.mandate?.mandator?.organization ?? '' },
        { label: 'Common Name', valueGetter: (s) => s.mandate?.mandator?.commonName ?? '' },
        { label: 'Serial Number', valueGetter: (s) => s.mandate?.mandator?.serialNumber ?? '' },
        { label: 'Country', valueGetter: (s) => s.mandate?.mandator?.country ?? '' },
      ],
    },
     {
      section: 'Powers',
      fields: [
        {
          label: 'Powers',
          valueGetter: (s) =>
            (s.mandate?.power ?? [])
              .map((p: any, i: number) =>
                `#${i + 1}: ${p.function} (${p.domain}) → ${Array.isArray(p.action) ? p.action.join(', ') : p.action}`
              )
              .join('\n'),
        },
      ],
    },
  ],

  'gx:LabelCredential': [
    {
      section: 'Label Info',
      fields: [
        { label: 'Label ID', valueGetter: s => s.id },
        { label: 'Label Level', valueGetter: s => s['gx:labelLevel'] },
        { label: 'Engine Version', valueGetter: s => s['gx:engineVersion'] },
        { label: 'Rules Version', valueGetter: s => s['gx:rulesVersion'] },
      ],
    },
    {
      section: 'Compliant Credentials',
      fields: [
        {
          label: 'gx:compliantCredentials',
          valueGetter: s =>
            (s['gx:compliantCredentials'] ?? [])
              .map((c: any, i: number) =>
                `#${i + 1}: ${c.id} - ${c['gx:digestSRI']}`
              )
              .join('\n'),
        },
      ],
    },
    {
      section: 'Validated Criteria',
      fields: [
        {
          label: 'gx:validatedCriteria',
          valueGetter: s =>
            (s['gx:validatedCriteria'] ?? [])
              .map((v: string, i: number) => `- ${v}`)
              .join('\n'),
        },
      ],
    },
  ]
};
