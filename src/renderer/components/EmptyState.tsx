import { Button, Center, Stack, Text } from "@mantine/core";

interface EmptyStateProps {
  onAdd: () => void;
}

const EmptyState = (props: EmptyStateProps) => {
  return (
    <Center mih="calc(100vh - 44px)">
      <Stack align="center" gap="md">
        <Text c="dimmed">Add a profile to get started</Text>
        <Button onClick={props.onAdd}>Add Profile</Button>
      </Stack>
    </Center>
  );
};

export default EmptyState;
