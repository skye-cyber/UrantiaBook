// Type definitions
export interface Note {
  timestamp: string;
  title?: string;
  content: string;
  [key: string]: any;
}

export interface BookmarkData {
  part_id: string;
  paper_id: string;
  section_number: string;
  id?: string;
  addedAt?: string;
  [key: string]: any;
}

export interface FavouriteData {
  part_id: string;
  paper_id: string;
  section_number: string;
  addedAt?: string;
  [key: string]: any;
}

export interface DefaultTTSEngine {
  name: string
  engine: string
  command: string;
  inputType: string;
  outputFormat: string;
  maxTextLength: number;
}

export interface TTSConfig {
  defaultEngine: DefaultTTSEngine
  engine: string;
  command: string;
  fallbackCommand: string;
  inputType: 'text' | 'file';
  outputFormat: string;
  maxTextLength: number;
}

export interface userSettings {
  appearance: {
    theme: string,
    fontSize: number,
    fontFamily: string,
    focusMode: boolean,
    reducedMotion: boolean
  },
  search: {
    defaultMode: string,
    defaultParts: number[],
    caseSensitive: boolean,
    wholeWords: boolean,
    historySize: number,
    saveHistory: boolean
  },
  reader: {
    fontSize: number,
    fontName: string,
    fontFamily: string,
    lineHeight: number | any,
    maxWidth: number,
    justifyText: boolean,
    autoScrollSpeed: number,
    Fonts: [
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      }
    ],
    Themes: [
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      },
      {
        label: string,
        value: string
      }
    ]
  },
  audio: {
    voice: string,
    speed: number|any,
    pitch: number,
    autoPlay: boolean
  },
  privacy: {
    analytics: boolean,
    crashReports: boolean,
    autoSaveNotes: boolean
  },
  shortcuts: {
    toggleSearch: string,
    toggleSettings: string,
    toggleReader: string,
    toggleDarkMode: string
  }
}

export interface AppConfig {
  tts: TTSConfig;
  appearance: {
    theme: string;
    fontSize: number;
  };
  paths: {
    notes: string;
    favourites: string;
    bookmark: string;
    cache: string;
  };
  user: userSettings
}

export interface ToggleResult {
  success: boolean;
  task: 'add' | 'remove' | 'none' | 'error';
}

