import {
  Button,
  Group,
  PasswordInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { type FormEventHandler, useState } from "react";
//Types
import type { Profile, ProfileInput } from "../../shared/types/profile";
//Constants
import { DEFAULT_REGION, REGIONS } from "../constants/regions";

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (profile: ProfileInput) => void;
  onCancel: () => void;
}

const regionOptions = REGIONS.map((r) => ({
  value: r.value,
  label: `${r.label} - ${r.value}`,
}));

const ProfileForm = (props: ProfileFormProps) => {
  const [name, setName] = useState(props.profile?.name ?? "");
  const [accessKey, setAccessKey] = useState(props.profile?.accessKey ?? "");
  const [secretKey, setSecretKey] = useState(props.profile?.secretKey ?? "");
  const [mfaDevice, setMfaDevice] = useState(props.profile?.mfaDevice ?? "");
  const [region, setRegion] = useState<string | null>(props.profile?.region ?? DEFAULT_REGION);
  const [isDefault, setIsDefault] = useState(props.profile?.isDefault ?? false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    props.onSave({
      name: name.trim(),
      accessKey: accessKey.trim(),
      secretKey: secretKey.trim(),
      mfaDevice: mfaDevice.trim() || null,
      region: region ?? DEFAULT_REGION,
      isDefault,
    });
  };

  return (
    <Stack gap="md" p="lg" maw={620}>
      <Title order={3}>{props.profile ? "Edit Profile" : "Add Profile"}</Title>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Profile Name"
            placeholder="e.g. my-project-dev"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            disabled={!!props.profile}
          />
          <TextInput
            label="Access Key ID"
            placeholder="AKIA..."
            value={accessKey}
            onChange={(e) => setAccessKey(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Secret Access Key"
            placeholder="Secret access key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.currentTarget.value)}
            required
          />
          <TextInput
            label="MFA Device ARN"
            description="Optional"
            placeholder="arn:aws:iam::123456789012:mfa/user"
            value={mfaDevice}
            onChange={(e) => setMfaDevice(e.currentTarget.value)}
          />
          <Select
            label="AWS Region"
            data={regionOptions}
            value={region}
            onChange={setRegion}
            searchable
            allowDeselect={false}
            maxDropdownHeight={280}
          />
          <Switch
            checked={isDefault}
            onChange={(e) => setIsDefault(e.currentTarget.checked)}
            label="Set as default profile"
            description="Writes session credentials to [default] in ~/.aws/credentials so you can use AWS CLI without --profile"
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={props.onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">{props.profile ? "Update Profile" : "Save Profile"}</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default ProfileForm;
