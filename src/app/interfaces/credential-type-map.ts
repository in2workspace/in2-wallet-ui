export interface FieldConfig {
  label: string;
  valueGetter: (subject: any) => string;
}

export interface CredentialMapConfig {
  icon: string;
  fields: FieldConfig[];
}

export const CredentialTypeMap: Record<string, CredentialMapConfig> = {
  LEARCredentialEmployee: {
    icon: 'assets/icons/LearCredentialEmployee.png',
    fields: [
      { valueGetter: (s) => s.mandate.mandatee.firstName },
      { valueGetter: (s) => s.mandate.mandatee.lastName },
      { valueGetter: (s) => s.mandate.mandator.organization }      
    ],
  },
  LEARCredentialMachine: {
    icon: 'assets/icons/LearCredentialMachine.png',
    fields: [
      { valueGetter: (s) => s.mandate.mandatee.ipAddress ?? '' },
      { valueGetter: (s) => s.mandate.mandatee.domain ?? '' },
      { valueGetter: (s) => s.mandate.mandator.organization },
    ],
  },
  'gx:LabelCredential': { //TODO: Revisar que funcionamiento es ok para label
    icon: 'assets/icons/LabelCredential.png',
    fields: [
      { label: valueGetter: (s) => s.id }, //REvisar
      { label: valueGetter: (s) => s.gx_labelLevel },
    ],
  },
};
