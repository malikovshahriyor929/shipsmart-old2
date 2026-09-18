'use client';

import { useTheme } from 'next-themes';
import { Switch } from 'rizzui';
import { useEffect } from 'react';
import { updateThemeColor } from '@core/utils/update-theme-color';
import { presetDark, presetLight } from '@core/config/color-presets';
import { useColorPresetName } from '@core/layouts/settings/use-theme-color';
import { PiSun,PiMoon } from 'react-icons/pi';
import cn from '@core/utils/class-names';

export default function StyledThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { colorPresetName } = useColorPresetName();
  const isDarkMode = theme === 'dark';

  // Apply theme color presets
  useEffect(() => {
    if (theme === 'light' && colorPresetName === 'black') {
      updateThemeColor(
        presetLight.lighter,
        presetLight.light,
        presetLight.default,
        presetLight.dark,
        presetLight.foreground
      );
    }
    if (theme === 'dark' && colorPresetName === 'black') {
      updateThemeColor(
        presetDark.lighter,
        presetDark.light,
        presetDark.default,
        presetDark.dark,
        presetDark.foreground
      );
    }
  }, [theme, colorPresetName]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Switch
      checked={isDarkMode}
      onChange={toggleTheme}
      offIcon={<PiSun className="h-3.5 w-3.5" />}
      onIcon={<PiMoon className="h-3 w-3" />}
      className={cn(
        'flex h-full w-full items-center justify-center',
        'shadow-none !ring-0 !focus:outline-none !focus:ring-0 !focus-visible:outline-none',
        '[&>span]:border-0 [&>span]:bg-transparent [&>span]:before:shadow-none',
        '[&>span]:before:bg-amber-500 dark:[&>span]:before:bg-indigo-500',
        "[&>span]:before:content-['☀️'] dark:[&>span]:before:content-['🌙']",
        '[&>span]:before:flex [&>span]:before:items-center [&>span]:before:justify-center',
        '[&>span]:before:text-[11px] [&>span]:before:leading-none'
      )}
    />
  );
}
