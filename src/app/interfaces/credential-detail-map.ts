export interface DetailField {
  label: string;
  valueGetter: (subject: any, vc: any) => string;
}

export interface DetailSection {
  section: string;
  fields: DetailField[];
}

export interface EvaluatedField {
  label: string;
  value: string;
}

export interface EvaluatedSection {
  section: string;
  fields: EvaluatedField[];
}

export type CredentialDetailMapEntry =
  | DetailSection[]
  | ((subject: any, vc: any) => DetailSection[]);


export const CredentialDetailMap: Record<string, CredentialDetailMapEntry> = {
  LEARCredentialEmployee: (s) => [
    {
      section: 'Mandatee',
      fields: [
        { label: 'First Name', valueGetter: () => s.mandate?.mandatee?.firstName ?? '' },
        { label: 'Last Name', valueGetter: () => s.mandate?.mandatee?.lastName ?? '' },
        { label: 'Email', valueGetter: () => s.mandate?.mandatee?.email ?? '' },
        { label: 'Nationality', valueGetter: () => s.mandate?.mandatee?.nationality ?? '' },
      ],
    },
    {
      section: 'Mandator',
      fields: [
        { label: 'Organization', valueGetter: () => s.mandate?.mandator?.organization ?? '' },
        { label: 'Common Name', valueGetter: () => s.mandate?.mandator?.commonName ?? '' },
        { label: 'Serial Number', valueGetter: () => s.mandate?.mandator?.serialNumber ?? '' },
        { label: 'Country', valueGetter: () => s.mandate?.mandator?.country ?? '' },
        { label: 'Email Address', valueGetter: () => s.mandate?.mandator?.emailAddress ?? '' },
        { label: 'Identifier', valueGetter: () => s.mandate?.mandator?.organizationIdentifier ?? '' },
      ],
    },
    {
      section: 'Powers',
      fields: (s.mandate?.power ?? []).map((p: any, i: number) => ({
        label: `#${i + 1}`,
        valueGetter: () => `${p.function} (${p.domain}) → ${Array.isArray(p.action) ? p.action.join(', ') : p.action}`,
      })),
    },
  ],

  LEARCredentialMachine: (s) => [
    {
      section: 'Machine Info',
      fields: [
        { label: 'IP Address', valueGetter: () => s.mandate?.mandatee?.ipAddress ?? '' },
        { label: 'Domain', valueGetter: () => s.mandate?.mandatee?.domain ?? '' },
        { label: 'ID', valueGetter: () => s.mandate?.mandatee?.id ?? '' },
      ],
    },
    {
      section: 'Mandator',
      fields: [
        { label: 'Organization', valueGetter: () => s.mandate?.mandator?.organization ?? '' },
        { label: 'Common Name', valueGetter: () => s.mandate?.mandator?.commonName ?? '' },
        { label: 'Serial Number', valueGetter: () => s.mandate?.mandator?.serialNumber ?? '' },
        { label: 'Country', valueGetter: () => s.mandate?.mandator?.country ?? '' },
      ],
    },
    {
      section: 'Powers',
      fields: (s.mandate?.power ?? []).map((p: any, i: number) => ({
        label: `#${i + 1}`,
        valueGetter: () => `${p.function} (${p.domain}) → ${Array.isArray(p.action) ? p.action.join(', ') : p.action}`,
      })),
    },
  ],

  'gx:LabelCredential': [
    {
      section: 'Label Info',
      fields: [
        { label: 'Label ID', valueGetter: (s) => s.id },
        { label: 'Label Level', valueGetter: (s) => s['gx:labelLevel'] },
        { label: 'Engine Version', valueGetter: (s) => s['gx:engineVersion'] },
        { label: 'Rules Version', valueGetter: (s) => s['gx:rulesVersion'] },
      ],
    },
    {
      section: 'Compliant Credentials',
      fields: [
        {
          label: 'gx:compliantCredentials',
          valueGetter: (s) =>
            (s['gx:compliantCredentials'] ?? [])
              .map((c: any, i: number) => `#${i + 1}: ${c.id} - ${c['gx:digestSRI']}`)
              .join('\n'),
        },
      ],
    },
    {
      section: 'Validated Criteria',
      fields: [
        {
          label: 'gx:validatedCriteria',
          valueGetter: (s) =>
            (s['gx:validatedCriteria'] ?? [])
              .map((v: string) => `- ${v}`)
              .join('\n'),
        },
      ],
    },
  ],
};
