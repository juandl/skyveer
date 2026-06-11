import { AppShell, Group, Text } from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";
import { useCallback, useEffect, useState } from "react";
//Types
import type { Profile, ProfileInput } from "../shared/types/profile";
//Components
import EmptyState from "./components/EmptyState";
import ProfileDetail from "./components/ProfileDetail";
import ProfileForm from "./components/ProfileForm";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
//Constants
import { APP_NAME } from "./config/app";
import { TOAST_TYPE, VIEW, type View } from "./constants/ui";
//Helpers
import { showToast } from "./helpers/notify";

const App = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [view, setView] = useState<View>(VIEW.EMPTY);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const selected = profiles.find((p) => p.name === selectedName) ?? null;

  useEffect(() => {
    window.api.getProfiles().then((data) => {
      setProfiles(data);
      if (data.length > 0) {
        setSelectedName(data[0].name);
        setView(VIEW.DETAIL);
      }
    });
  }, []);

  const handleAddProfile = useCallback(() => {
    setEditingProfile(null);
    setView(VIEW.FORM);
  }, []);

  const handleEditProfile = useCallback(() => {
    setEditingProfile(selected);
    setView(VIEW.FORM);
  }, [selected]);

  const handleSaveProfile = async (profile: ProfileInput) => {
    try {
      const updated = await window.api.addProfile(profile);
      setProfiles(updated);
      setSelectedName(profile.name);
      setView(VIEW.DETAIL);
      showToast(editingProfile ? "Profile updated" : "Profile added");
    } catch (err) {
      showToast(`Error: ${(err as Error).message}`, TOAST_TYPE.ERROR);
    }
  };

  const handleDeleteProfile = useCallback(() => {
    if (!selected) return;
    modals.openConfirmModal({
      title: "Delete profile",
      children: (
        <Text size="sm">
          Delete profile <strong>{selected.name}</strong>? This removes it from
          <code> ~/.aws/credentials</code> too.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const updated = await window.api.deleteProfile(selected.name);
          setProfiles(updated);
          if (updated.length > 0) {
            setSelectedName(updated[0].name);
            setView(VIEW.DETAIL);
          } else {
            setSelectedName(null);
            setView(VIEW.EMPTY);
          }
          showToast("Profile deleted");
        } catch (err) {
          showToast(`Error: ${(err as Error).message}`, TOAST_TYPE.ERROR);
        }
      },
    });
  }, [selected]);

  const handleLogin = async (otpCode: string | null) => {
    if (!selected) return;
    try {
      const result = await window.api.login(selected.name, otpCode || null);
      setProfiles(result.profiles);
      showToast("Login successful — credentials written to ~/.aws/credentials");
    } catch (err) {
      showToast(`Login failed: ${(err as Error).message}`, TOAST_TYPE.ERROR);
    }
  };

  const handleLogout = useCallback(() => {
    if (!selected) return;
    modals.openConfirmModal({
      title: "Delete session",
      children: (
        <Text size="sm">
          Delete the session and remove credentials from <code>~/.aws/credentials</code>?
        </Text>
      ),
      labels: { confirm: "Logout", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const updated = await window.api.logout(selected.name);
          setProfiles(updated);
          showToast("Session deleted");
        } catch (err) {
          showToast(`Error: ${(err as Error).message}`, TOAST_TYPE.ERROR);
        }
      },
    });
  }, [selected]);

  const handleSetDefault = async () => {
    if (!selected) return;
    try {
      const updated = await window.api.setDefault(selected.name);
      setProfiles(updated);
      showToast(`"${selected.name}" is now the default profile`);
    } catch (err) {
      showToast(`Error: ${(err as Error).message}`, TOAST_TYPE.ERROR);
    }
  };

  const handleSelectProfile = (name: string) => {
    setSelectedName(name);
    setView(VIEW.DETAIL);
  };

  const handleCancelForm = () => {
    if (selected) {
      setView(VIEW.DETAIL);
    } else if (profiles.length > 0) {
      setSelectedName(profiles[0].name);
      setView(VIEW.DETAIL);
    } else {
      setView(VIEW.EMPTY);
    }
  };

  return (
    <ModalsProvider>
      <AppShell header={{ height: 44 }} navbar={{ width: 260, breakpoint: "xs" }} padding={0}>
        <AppShell.Header
          className="titlebar-drag"
          style={{ backgroundColor: "#0c1832", borderColor: "#1c2540" }}
        >
          <Group h="100%" pl={84} pr="md" justify="space-between" wrap="nowrap">
            <Text fw={600} size="sm" c="#e6ecf5">
              {APP_NAME}
            </Text>
            <ThemeToggle />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Sidebar
            profiles={profiles}
            selectedName={selectedName}
            onSelect={handleSelectProfile}
            onAdd={handleAddProfile}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          {view === VIEW.EMPTY && <EmptyState onAdd={handleAddProfile} />}
          {view === VIEW.FORM && (
            <ProfileForm
              profile={editingProfile}
              onSave={handleSaveProfile}
              onCancel={handleCancelForm}
            />
          )}
          {view === VIEW.DETAIL && selected && (
            <ProfileDetail
              profile={selected}
              onEdit={handleEditProfile}
              onDelete={handleDeleteProfile}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onSetDefault={handleSetDefault}
            />
          )}
        </AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
};

export default App;
