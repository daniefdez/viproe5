import React from 'react';

type IconProps = {
  className?: string;
};

export const IconUpload: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const IconPhoto: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const IconEye: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const IconPaintbrush: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.53 16.122.018-.018A5.25 5.25 0 0 1 10.5 14H14a1 1 0 0 1 1 1v1.5M16.5 6.311.646 16.165a1.875 1.875 0 0 0 2.652 2.652L12.835 8.48M16.5 6.311A5.25 5.25 0 0 0 10.5 3H5.25a1 1 0 0 0-1 1v5.25a5.25 5.25 0 0 0 3.311 4.784" />
    </svg>
);

export const IconShieldCheck: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const IconShieldExclamation: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const IconChartBar: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

export const IconClipboardList: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75c0-.231-.035-.454-.1-.664M6.75 7.5H18a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25-2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25Z" />
    </svg>
);

export const IconServer: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.65H8.228a3.375 3.375 0 0 0-3.285 2.65l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
    </svg>
);

export const IconBrain: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 1-5.78 1.128 2.25 2.25 0 0 1-2.475-2.118L.062 9.61a2.25 2.25 0 0 1 1.81-2.445l1.358-.27a2.25 2.25 0 0 0 2.064-2.185V2.25a2.25 2.25 0 0 1 2.25-2.25h3.518a2.25 2.25 0 0 1 2.174 1.342l.285.57a2.25 2.25 0 0 0 2.174 1.342h3.518a2.25 2.25 0 0 1 2.25 2.25v4.135a2.25 2.25 0 0 0 2.064 2.185l1.358.27a2.25 2.25 0 0 1 1.81 2.445l-1.215 4.372a2.25 2.25 0 0 1-2.475 2.118 3 3 0 0 1-5.78-1.128v-1.65a1.125 1.125 0 0 0-1.125-1.125h-1.5a1.125 1.125 0 0 0-1.125 1.125v1.65Z" />
  </svg>
);

export const IconVisionAI: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className={className}>
        <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.16 12.04c-1.24-3.52-4.14-6.04-8.84-6.04C7.01 6 3.65 9.01 2.83 12.04" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.83 11.96c.82 3.03 4.18 6.04 9.49 6.04 4.7 0 7.6-2.52 8.84-6.04" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 9.5v-3" strokeLinecap="round" />
        <path d="M9.5 14.5v3" strokeLinecap="round" />
        <path d="M17 12h3.5" strokeLinecap="round" />
        <path d="M3.5 12H7" strokeLinecap="round" />
    </svg>
);


export const IconChip: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25H21M15.75 21v-1.5M4.5 15.75H3m18 0h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
);

export const IconLayers: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M2.25 12l8.954 8.955c.44.439 1.152.439 1.591 0L21.75 12M2.25 12h19.5" />
    </svg>
);

export const IconZap: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm.375-3a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm.375 3a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const IconMapPin: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const IconCode: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" />
    </svg>
);

export const IconHelpCircle: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
);

export const IconZoomIn: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
    </svg>
);

export const IconKey: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8.25 9.75A2.25 2.25 0 0 1 6 12a2.25 2.25 0 0 1-2.25-2.25S4.5 3 9 3s3.75 6.75 3.75 6.75" />
    </svg>
);

export const IconClipboard: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612 0 .662-.534 1.2-1.2 1.2h-3c-.662 0-1.2-.534-1.2-1.2 0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);

export const IconCheck: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export const IconDownload: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const IconTwitter: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const IconFacebook: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12Z" clipRule="evenodd" />
    </svg>
);

export const IconPinterest: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.399-.043-.88.106-1.284.144-.391.903-3.82 1.043-4.263.136-.421.083-.64.083-.962 0-.895-.538-1.564-1.207-1.564-.972 0-1.425.723-1.425 1.59 0 .428.16.89.378 1.343.232.482.264.57.19.972-.075.407-.248.995-.373 1.442-.144.53-.41.742-.88.494-.99-.527-1.6-1.99-1.6-3.196 0-2.344 1.716-4.22 4.33-4.22 2.247 0 3.89,1.637 3.89,3.75 0,2.256-1.13,4.02-2.82,4.02-.743 0-1.282-.6-1.118-1.32.19-.82.635-1.956.767-2.474.152-.61.128-1.21.24-1.77.135-.673.742-1.333 1.488-1.333.795,0,1.564.83,1.564,2.396,0,1.393-.995,3.318-2.367,3.318-.47,0-.9-.24-.9-.47,0-.223.083-.438.16-.623.22-.527.682-1.42.682-1.42s.22-.88.314-.88c.17,0,.438.187.438.59,0,.765-.83,1.927-.83,1.927s-1.23,2.233-1.857,2.233c-1.175,0-2.14-1.54-2.14-3.55,0-1.97,1.232-3.31,2.94-3.31,1.5,0,2.5,1.1,2.5,2.5,0,1.56-.47,2.79-.47,2.79s-.22,1.333-.438,1.333c-.22,0-.565-.682-.565-.682s-.22-1.118-.314-1.118c-.17,0-.438.565-.438.565s-.22,1.232-.314,1.232c-.17,0-.314-1.118-.314-1.118s-.083-1.118-.16-1.118c-.17,0-.438.742-.438.742s-.565,2.14-1.118,2.14c-.9,0-1.5-1.5-1.5-2.5,0-1.5.742-2.5,1.5-2.5.742,0,1.118.565,1.118.565s.22,1.118.314,1.118c.17,0,.438-.565.438-.565s.22-1.118-.314-1.118c-.17,0-.438.565-.438.565" />
    </svg>
);

export const IconReddit: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.01,2.5C6.75,2.5,2.5,6.75,2.5,12.01c0,5.26,4.25,9.51,9.51,9.51s9.51-4.25,9.51-9.51C21.52,6.75,17.27,2.5,12.01,2.5z M12.01,20.02c-4.43,0-8.02-3.59-8.02-8.01s3.59-8.02,8.02-8.02s8.02,3.6,8.02,8.02S16.44,20.02,12.01,20.02z"/>
        <path d="M12,8.22c-2.02,0-3.67,1.64-3.67,3.67c0,2.02,1.64,3.67,3.67,3.67c2.02,0,3.67-1.64,3.67-3.67C15.67,9.86,14.02,8.22,12,8.22z M12,14.06c-1.14,0-2.07-0.93-2.07-2.07s0.93-2.07,2.07-2.07s2.07,0.93,2.07,2.07S13.14,14.06,12,14.06z"/>
        <path d="M18.89,11.23c-0.78-0.78-1.83-1.22-2.92-1.22c-1.1,0-2.14,0.44-2.92,1.22c-0.78,0.78-1.22,1.83-1.22,2.92c0,1.1,0.44,2.14,1.22,2.92c0.78,0.78,1.83,1.22,2.92,1.22c1.1,0,2.14-0.44,2.92-1.22c0.78-0.78,1.22-1.83,1.22-2.92C20.11,13.06,19.67,12.01,18.89,11.23z M17.47,15.65c-0.39,0.39-0.91,0.61-1.46,0.61c-0.55,0-1.07-0.22-1.46-0.61c-0.39-0.39-0.61-0.91-0.61-1.46c0-0.55,0.22-1.07,0.61-1.46c0.39-0.39,0.91-0.61,1.46-0.61c0.55,0,1.07,0.22,1.46,0.61c0.39,0.39,0.61,0.91,0.61,1.46C18.08,14.74,17.86,15.26,17.47,15.65z"/>
        <path d="M9.81,11.23c-0.78-0.78-1.83-1.22-2.92-1.22c-1.1,0-2.14,0.44-2.92,1.22c-0.78,0.78-1.22,1.83-1.22,2.92c0,1.1,0.44,2.14,1.22,2.92c0.78,0.78,1.83,1.22,2.92,1.22c1.1,0,2.14-0.44,2.92-1.22c0.78-0.78,1.22-1.83,1.22-2.92C11.03,13.06,10.59,12.01,9.81,11.23z M8.39,15.65c-0.39,0.39-0.91,0.61-1.46,0.61c-0.55,0-1.07-0.22-1.46-0.61c-0.39-0.39-0.61-0.91-0.61-1.46c0-0.55,0.22-1.07,0.61-1.46c0.39-0.39,0.91-0.61,1.46-0.61c0.55,0,1.07,0.22,1.46,0.61c0.39,0.39,0.61,0.91,0.61,1.46C8.99,14.74,8.78,15.26,8.39,15.65z"/>
    </svg>
);

export const IconDiscord: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.317 4.36981C18.7915 3.08433 16.8115 2.15545 14.6425 1.76542C14.4175 2.21332 14.2085 2.76918 14.0325 3.25111C12.3815 2.99818 10.7305 2.99818 9.0785 3.25111C8.9025 2.76918 8.6935 2.21332 8.4685 1.76542C6.2995 2.15545 4.3195 3.08433 2.7945 4.36981C0.633499 7.4278 0.0334994 10.8418 0.528499 14.1297C2.4605 15.6457 4.2695 16.6336 5.9985 17.2916C6.2795 16.8526 6.5275 16.3907 6.7425 15.9057C6.0125 15.5417 5.3155 15.1117 4.6655 14.6298C4.7825 14.5458 4.8995 14.4578 5.0115 14.3668C8.1755 16.5127 12.0475 16.5127 15.2115 14.3668C15.3235 14.4578 15.4405 14.5458 15.5575 14.6298C14.9075 15.1117 14.2105 15.5417 13.4805 15.9057C13.6955 16.3907 13.9435 16.8526 14.2245 17.2916C15.9535 16.6336 17.7625 15.6457 19.6945 14.1297C20.1895 10.8418 19.5895 7.4278 17.4285 4.36981H20.317Z" />
        <path d="M7.74955 12.0001C7.02955 12.0001 6.44955 11.3321 6.44955 10.5001C6.44955 9.66708 7.02955 9.00009 7.74955 9.00009C8.47055 9.00009 9.04955 9.66708 9.04955 10.5001C9.04955 11.3321 8.47055 12.0001 7.74955 12.0001Z" />
        <path d="M12.4833 12.0001C11.7633 12.0001 11.1833 11.3321 11.1833 10.5001C11.1833 9.66708 11.7633 9.00009 12.4833 9.00009C13.2043 9.00009 13.7833 9.66708 13.7833 10.5001C13.7833 11.3321 13.2043 12.0001 12.4833 12.0001Z" />
    </svg>
);


export const IconGallery: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const IconWand: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.242.013.487.02.73.02a9.75 9.75 0 019.75 9.75c0 .243-.007.488-.02.731M9.75 3.104a2.25 2.25 0 00-1.618-1.618C7.886 1.472 7.64 1.45 7.382 1.45 3.866 1.45 1 4.316 1 7.832c0 .258.022.504.06.748a2.25 2.25 0 001.618 1.618M14.5 5l-1 1M16.5 7l-1 1M18.5 9l-1 1M20.5 11l-1 1" />
    </svg>
);