import { Badge, Button, Group, Loader, Paper, PinInput, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
//Types
import type { CallerIdentity, Profile } from "../../shared/types/profile";
//Constants
import { OTP_LENGTH, TOAST_TYPE } from "../constants/ui";
//Helpers
import { maskKey } from "../helpers/format";
import { showToast } from "../helpers/notify";
import { isSessionExpired } from "../helpers/session";

interface ProfileDetailProps {
  profile: Profile;
  onEdit: () => void;
  onDelete: () => void;
  onLogin: (otp: string) => Promise<void>;
  onLogout: () => void;
  onSetDefault: () => void;
}

const InfoRow = (info: { label: string; value: string }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {info.label}
    </Text>
    <Text size="sm" ff="monospace" style={{ wordBreak: "break-all" }}>
      {info.value}
    </Text>
  </Stack>
);

const ProfileDetail = (props: ProfileDetailProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<CallerIdentity | null>(null);

  const session = props.profile.session;
  const isExpired = session ? isSessionExpired(session.expiration) : false;
  const hasSession = !!session && !isExpired;

  useEffect(() => {
    setOtp("");
    setSessionInfo(null);
    if (session && !isExpired) {
      window.api.verifySession(props.profile.name).then((result) => {
        if (result.valid) {
          setSessionInfo(result.identity);
        }
      });
    }
  }, [props.profile.name, session, isExpired]);

  const handleLogin = async () => {
    if (props.profile.mfaDevice && otp.length !== OTP_LENGTH) {
      showToast(`Enter a ${OTP_LENGTH}-digit OTP code`, TOAST_TYPE.ERROR);
      return;
    }
    setLoading(true);
    try {
      await props.onLogin(otp);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const sessionStatusLabel = hasSession
    ? "Session active"
    : isExpired
      ? "Session expired"
      : "No active session";
  const sessionStatusColor = hasSession ? "teal" : isExpired ? "orange" : "gray";

  return (
    <Stack gap="lg" p="lg">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm">
          <Title order={2}>{props.profile.name}</Title>
          {props.profile.isDefault && (
            <Badge color="blue" variant="filled">
              DEFAULT
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          {!props.profile.isDefault && (
            <Button variant="default" size="xs" onClick={props.onSetDefault}>
              Set as Default
            </Button>
          )}
          <Button variant="default" size="xs" onClick={props.onEdit}>
            Edit
          </Button>
          <Button variant="light" color="red" size="xs" onClick={props.onDelete}>
            Delete
          </Button>
        </Group>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Group grow align="flex-start">
            <InfoRow label="Region" value={props.profile.region} />
            <InfoRow label="Access Key" value={maskKey(props.profile.accessKey)} />
          </Group>
          <InfoRow label="MFA Device" value={props.profile.mfaDevice || "Not configured"} />
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="md">
          <Group gap="sm">
            <Badge color={sessionStatusColor} variant="dot">
              {sessionStatusLabel}
            </Badge>
          </Group>
          {session && (
            <Group grow align="flex-start">
              <InfoRow label="Expires" value={new Date(session.expiration).toLocaleString()} />
              {sessionInfo && <InfoRow label="Account" value={sessionInfo.account} />}
            </Group>
          )}
        </Stack>
      </Paper>

      {hasSession ? (
        <Group>
          <Button color="red" onClick={props.onLogout}>
            Delete Session & Logout
          </Button>
        </Group>
      ) : (
        <Paper withBorder p="md" radius="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Stack gap="md">
              <Title order={5}>{props.profile.mfaDevice ? "Login with MFA" : "Login"}</Title>
              {props.profile.mfaDevice ? (
                <PinInput
                  length={OTP_LENGTH}
                  size="lg"
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleLogin}
                  type="number"
                  oneTimeCode
                  disabled={loading}
                  autoFocus
                  styles={{ root: { width: "100%", justifyContent: "space-between" } }}
                />
              ) : (
                <Text size="sm" c="dimmed">
                  OTP not required
                </Text>
              )}
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? (
                  <Group gap="xs">
                    <Loader size="xs" color="white" />
                    <span>Logging in…</span>
                  </Group>
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      )}
    </Stack>
  );
};

export default ProfileDetail;
