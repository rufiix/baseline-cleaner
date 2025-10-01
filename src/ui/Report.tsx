import React from 'react';
import { Box, Text, Newline } from 'ink';

// Definiujemy bardziej szczegółowy typ dla naszych rekomendacji dla bezpieczeństwa
type Recommendation = {
  library: string;
  feature: string;
  baselineStatus: 'high' | 'low' | 'unknown';
  isRemovable: boolean;
};

type ReportProps = {
  recommendations: Recommendation[];
};

// Mały komponent pomocniczy do wyświetlania statusu w kolorze
const StatusIndicator = ({ status }: { status: Recommendation['baselineStatus'] }) => {
  if (status === 'high') {
    return <Text color="green" bold>✓ Fully Supported (Safe to Remove)</Text>;
  }
  if (status === 'low') {
    return <Text color="yellow">~ Limited Support (Use with Caution)</Text>;
  }
  return <Text color="gray">? Unknown</Text>;
};

export function Report({ recommendations }: ReportProps) {
  return (
    <Box borderStyle="double" paddingX={2} paddingY={1} flexDirection="column" borderColor="cyan">
      <Text bold color="cyan">
        📊 Baseline Cleaner Report
      </Text>
      <Newline />

      {recommendations.length === 0 && (
        <Text color="green">✅ No actively used polyfills found. Your project looks clean!</Text>
      )}

      {recommendations.map((rec, index) => (
        <Box key={index} flexDirection="column" marginBottom={index === recommendations.length - 1 ? 0 : 1}>
          <Text bold color="white">{`• ${rec.library}`}</Text>
          <Box marginLeft={2} flexDirection="column">
            <Text>
              Replaced by native feature: <Text italic>{rec.feature}</Text>
            </Text>
            <Text>
              Baseline Status: <StatusIndicator status={rec.baselineStatus} />
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}