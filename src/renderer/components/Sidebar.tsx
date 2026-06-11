import { ActionIcon, Badge, Group, ScrollArea, Stack, Text, UnstyledButton } from "@mantine/core";
//Types
import type { Profile } from "../../shared/types/profile";
//Constants
import { SESSION_STATUS } from "../constants/ui";
//Helpers
import { getSessionStatus } from "../helpers/session";

interface SidebarProps {
  profiles: Profile[];
  selectedName: string | null;
  onSelect: (name: string) => void;
  onAdd: () => void;
}

const statusColor = {
  [SESSION_STATUS.ACTIVE]: "teal",
  [SESSION_STATUS.EXPIRED]: "orange",
  [SESSION_STATUS.NONE]: "gray",
} as const;

const Sidebar = (props: SidebarProps) => {
  return (
    <Stack gap={0} h="100%">
      <Group justify="space-between" p="sm" wrap="nowrap">
        <Text fw={600} size="sm" tt="uppercase" c="dimmed">
          Profiles
        </Text>
        <ActionIcon
          onClick={props.onAdd}
          variant="light"
          size="md"
          aria-label="Add profile"
          title="Add profile"
        >
          +
        </ActionIcon>
      </Group>
      <ScrollArea flex={1}>
        <Stack gap={4} px="xs" pb="xs">
          {props.profiles.map((p) => {
            const status = getSessionStatus(p);
            const isActive = props.selectedName === p.name;
            return (
              <UnstyledButton
                key={p.name}
                onClick={() => props.onSelect(p.name)}
                p="xs"
                style={(theme) => ({
                  borderRadius: theme.radius.sm,
                  backgroundColor: isActive ? "var(--mantine-color-default-hover)" : "transparent",
                })}
              >
                <Group gap="sm" wrap="nowrap">
                  <Badge size="xs" circle color={statusColor[status]} variant="filled">
                    {" "}
                  </Badge>
                  <Stack gap={2} flex={1} miw={0}>
                    <Group gap={6} wrap="nowrap">
                      <Text size="sm" fw={500} truncate>
                        {p.name}
                      </Text>
                      {p.isDefault && (
                        <Badge size="xs" variant="light" color="blue">
                          default
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed" truncate>
                      {p.region}
                    </Text>
                  </Stack>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default Sidebar;
