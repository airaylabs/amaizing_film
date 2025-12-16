// raymAIzing film - Integrated Production Platform (Celtx-Style)
// Synopsis-Driven Production System

// Default Opal Links - Pre-configured for all users
// Format: Tool ID -> Google Opal Flow URL
const DEFAULT_OPAL_LINKS = {
  // ============ PRE-PRODUCTION (01-04) ============
  '01': 'https://opal.google/?flow=drive:/1caOGG8vp2TVISN_p0Dody6KXdcP1Z72x&shared&mode=app', // Script to Treatment
  '02': 'https://opal.google/?flow=drive:/1diFY1SWTlrW3wHVFdfVwxyCCFOuggDjx&shared&mode=app', // Storyboard Creator
  '03': 'https://opal.google/?flow=drive:/179DbUhsxaUkuBWGXZdK_wnL3DrmraFKY&shared&mode=app', // Character Designer
  '04': 'https://opal.google/?flow=drive:/1QkYNFnLFOgCPHgz7VqgcpehgRCYI3zo3&shared&mode=app', // World Builder
  
  // ============ PRODUCTION - IMAGE (05-07) ============
  '05': 'https://opal.google/?flow=drive:/19CRO7mg8qtG1vm4v4ucWA-wj0q2K1a1R&shared&mode=app', // Text to Image Pro
  '06': 'https://opal.google/?flow=drive:/1V25vpVgTIeDrETg5uJofp6IRTI6jGNaa&shared&mode=app', // Character Transform
  '07': 'https://opal.google/?flow=drive:/1SVnB6fWc5dhSbgQKy0wnqTZR3JyzuGIP&shared&mode=app', // Scene Generator
  
  // ============ PRODUCTION - VIDEO (08-11) ============
  '08': 'https://opal.google/?flow=drive:/1HY70cooJOAZ0i_cUH8skmG1YnDHHXndQ&shared&mode=app', // Text to Video Pro (VEO 3)
  '09': 'https://opal.google/?flow=drive:/1old8n9i3ffOGKjjdfiJUMsUUCQQ0VK6E&shared&mode=app', // Image to Video Pro (VEO 3)
  '10': 'https://opal.google/?flow=drive:/1ydc01Pl2mw_x10ccuNlAty1fY2kPnSUj&shared&mode=app', // Dialogue Animator
  '11': 'https://opal.google/?flow=drive:/1pUK94WVmgVwI3tj-lbzrWl646Zmfxd0e&shared&mode=app', // Action Sequence
  
  // ============ POST-PRODUCTION (12-14) ============
  '12': 'https://opal.google/?flow=drive:/1ZFF8efHntb0lrmLjWkjzYRhP_OVDs7Zw&shared&mode=app', // Video Extender
  '13': 'https://opal.google/?flow=drive:/1OenPJRFgsFe9OgryYTKkP8gOg4jTI9Uv&shared&mode=app', // Transition Maker
  '14': 'https://opal.google/?flow=drive:/15-y85A94YJdZCq3F6o9ztGww1LzMcKY8&shared&mode=app', // Color Mood Matcher
  
  // ============ DISTRIBUTION (15-16) ============
  '15': 'https://opal.google/?flow=drive:/1IWqFICWLwv4q1zzkFsJmce2IfFP6zSA4&shared&mode=app', // Thumbnail Generator
  '16': 'https://opal.google/?flow=drive:/1PpDulaHTdhDO7WZ_GbVJ5kDRCrSfr0aa&shared&mode=app', // Poster & Promo
  
  // ============ IDEATION (idea-01 to idea-03) ============
  // These use Gemini for text generation - link to general Opal or AI Studio
  'idea-01': null, // Trend Explorer - uses Gemini text
  'idea-02': null, // Idea Generator - uses Gemini text
  'idea-03': null, // Genre Mixer - uses Gemini text
  
  // ============ STORY DEVELOPMENT (story-01 to story-04) ============
  // These use Gemini for text generation
  'story-01': null, // Synopsis Writer - uses Gemini text (CORE TOOL)
  'story-02': null, // Episode Breakdown - uses Gemini text
  'story-03': null, // Scene Planner - uses Gemini text
  'story-04': null, // Character Arc - uses Gemini text
  
  // ============ PRODUCTION - AUDIO (audio-01 to audio-04) ============
  // These would need audio generation Opal flows
  'audio-01': null, // Dialogue Generator - needs TTS Opal
  'audio-02': null, // Background Music - needs Music Gen Opal
  'audio-03': null, // Sound Effects - needs SFX Gen Opal
  'audio-04': null, // Audio Mixer - manual mixing
  
  // ============ POST-PRODUCTION EXTRAS (post-01 to post-03) ============
  'post-01': null, // Scene Assembler - manual editing
  'post-02': null, // Viral Picker - uses Gemini analysis
  'post-03': null, // Export Manager - manual export
  
  // ============ DISTRIBUTION EXTRAS (dist-01 to dist-02) ============
  'dist-01': null, // Social Clips - uses video tools
  'dist-02': null  // Trailer Maker - uses video tools
};

// ============ INTEGRATED PHASES (Celtx-Style) ============
const PHASES = [
  {
    id: 'ideation',
    name: 'Ideation',
    icon: '💡',
    color: 'yellow',
    description: 'Discover trends, generate ideas, find viral concepts',
    apps: [
      { id: 'idea-01', name: 'Trend Explorer', icon: '🔥', desc: 'Discover viral trends & topics', autoPopulate: false },
      { id: 'idea-02', name: 'Idea Generator', icon: '💡', desc: 'AI-powered story ideas', autoPopulate: false },
      { id: 'idea-03', name: 'Genre Mixer', icon: '🎲', desc: 'Combine genres for unique concepts', autoPopulate: false }
    ]
  },
  {
    id: 'story-development',
    name: 'Story Development',
    icon: '📖',
    color: 'purple',
    description: 'Create synopsis, breakdown episodes, plan scenes - THE CORE',
    apps: [
      { id: 'story-01', name: 'Synopsis Writer', icon: '📖', desc: 'Create master synopsis (auto-populates all)', autoPopulate: false, isCore: true },
      { id: 'story-02', name: 'Episode Breakdown', icon: '📑', desc: 'Auto-split into episodes', autoPopulate: true },
      { id: 'story-03', name: 'Scene Planner', icon: '🎬', desc: 'Auto-generate scene list', autoPopulate: true },
      { id: 'story-04', name: 'Character Arc', icon: '👥', desc: 'Auto-extract character journeys', autoPopulate: true }
    ]
  },
  {
    id: 'pre-production',
    name: 'Pre-Production',
    icon: '📝',
    color: 'cyan',
    description: 'Visual planning - auto-populated from synopsis',
    apps: [
      { id: '01', name: 'Script to Treatment', icon: '📝', desc: 'Auto-convert to visual breakdown', autoPopulate: true },
      { id: '02', name: 'Storyboard Creator', icon: '📋', desc: 'Auto-generate storyboards per scene', autoPopulate: true },
      { id: '03', name: 'Character Designer', icon: '👤', desc: 'Auto-design from character data', autoPopulate: true },
      { id: '04', name: 'World Builder', icon: '🌍', desc: 'Auto-design locations from scenes', autoPopulate: true }
    ]
  },
  {
    id: 'production-image',
    name: 'Production - Image',
    icon: '🎨',
    color: 'blue',
    description: 'Generate images - select scene/character to auto-fill',
    apps: [
      { id: '05', name: 'Text to Image Pro', icon: '🎨', desc: 'Generate scene images', autoPopulate: true },
      { id: '06', name: 'Character Transform', icon: '🔄', desc: 'Transform character photos', autoPopulate: true },
      { id: '07', name: 'Scene Generator', icon: '🎭', desc: 'Generate backgrounds', autoPopulate: true }
    ]
  },
  {
    id: 'production-video',
    name: 'Production - Video',
    icon: '🎬',
    color: 'pink',
    description: 'Generate videos - select scene to auto-fill',
    apps: [
      { id: '08', name: 'Text to Video Pro', icon: '🎬', desc: 'Generate scene videos (VEO 3)', autoPopulate: true },
      { id: '09', name: 'Image to Video Pro', icon: '✨', desc: 'Animate scene images', autoPopulate: true },
      { id: '10', name: 'Dialogue Animator', icon: '🗣️', desc: 'Animate character dialogue', autoPopulate: true },
      { id: '11', name: 'Action Sequence', icon: '⚔️', desc: 'Generate action scenes', autoPopulate: true }
    ]
  },
  {
    id: 'production-audio',
    name: 'Production - Audio',
    icon: '🔊',
    color: 'indigo',
    description: 'Generate audio - dialogue, music, SFX',
    apps: [
      { id: 'audio-01', name: 'Dialogue Generator', icon: '🎙️', desc: 'Generate character voices', autoPopulate: true },
      { id: 'audio-02', name: 'Background Music', icon: '🎵', desc: 'Generate scene music', autoPopulate: true },
      { id: 'audio-03', name: 'Sound Effects', icon: '🔉', desc: 'Generate scene SFX', autoPopulate: true },
      { id: 'audio-04', name: 'Audio Mixer', icon: '🎚️', desc: 'Mix all audio layers', autoPopulate: true }
    ]
  },
  {
    id: 'post-production',
    name: 'Post-Production',
    icon: '🎞️',
    color: 'green',
    description: 'Assemble, edit, pick viral moments',
    apps: [
      { id: '12', name: 'Video Extender', icon: '➕', desc: 'Extend video clips', autoPopulate: true },
      { id: '13', name: 'Transition Maker', icon: '🔀', desc: 'Create scene transitions', autoPopulate: true },
      { id: '14', name: 'Color Mood Matcher', icon: '🎨', desc: 'Match colors across scenes', autoPopulate: true },
      { id: 'post-01', name: 'Scene Assembler', icon: '🎬', desc: 'Combine scenes into episodes', autoPopulate: true },
      { id: 'post-02', name: 'Viral Picker', icon: '🔥', desc: 'AI picks viral-worthy moments', autoPopulate: true },
      { id: 'post-03', name: 'Export Manager', icon: '📤', desc: 'Export all formats', autoPopulate: true }
    ]
  },
  {
    id: 'distribution',
    name: 'Distribution',
    icon: '📢',
    color: 'orange',
    description: 'Create promotional content',
    apps: [
      { id: '15', name: 'Thumbnail Generator', icon: '🖼️', desc: 'Auto-generate thumbnails', autoPopulate: true },
      { id: '16', name: 'Poster & Promo', icon: '🎬', desc: 'Create posters from synopsis', autoPopulate: true },
      { id: 'dist-01', name: 'Social Clips', icon: '📱', desc: 'Create viral short clips', autoPopulate: true },
      { id: 'dist-02', name: 'Trailer Maker', icon: '🎥', desc: 'Auto-generate trailers', autoPopulate: true }
    ]
  }
];

// ============ DROPDOWN OPTIONS ============
const OPTIONS = {
  // Common
  styles: ['Photorealistic', 'Cinematic', 'Anime/Manga', 'Digital Art', 'Oil Painting', 'Watercolor', 'Concept Art', 'Fantasy Art', 'Comic Book', 'Minimalist', 'Vintage/Retro', '3D Render', 'Sketch'],
  lighting: ['Natural Daylight', 'Golden Hour', 'Blue Hour', 'Studio Lighting', 'Dramatic Side Light', 'Soft/Diffused', 'Neon/Cyberpunk', 'Backlit/Silhouette', 'Moonlight', 'Candlelight', 'Overcast', 'High Key', 'Low Key'],
  mood: ['Epic/Grand', 'Mysterious', 'Tense/Suspenseful', 'Romantic', 'Melancholic', 'Action/Intense', 'Peaceful/Serene', 'Horror/Dark', 'Cheerful', 'Nostalgic', 'Dreamy', 'Chaotic'],
  aspectRatio: ['16:9 Landscape', '9:16 Portrait', '1:1 Square', '21:9 Cinematic', '4:3 Classic', '2.39:1 Anamorphic'],
  
  // Character
  gender: ['Male', 'Female', 'Androgynous', 'Non-binary'],
  age: ['Child (5-12)', 'Teen (13-19)', 'Young Adult (20-30)', 'Adult (30-45)', 'Middle Age (45-60)', 'Elder (60+)'],
  expression: ['Neutral', 'Happy/Smiling', 'Sad/Tearful', 'Angry/Furious', 'Surprised', 'Scared', 'Determined', 'Confused', 'Loving', 'Mischievous', 'Contempt'],
  bodyType: ['Slim/Lean', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Petite', 'Tall/Lanky', 'Heavy'],
  characterRole: ['Protagonist', 'Antagonist', 'Supporting', 'Love Interest', 'Mentor', 'Comic Relief', 'Mysterious Stranger'],
  
  // Scene
  timeOfDay: ['Dawn', 'Morning', 'Midday', 'Afternoon', 'Golden Hour', 'Sunset', 'Blue Hour', 'Night', 'Midnight'],
  weather: ['Clear/Sunny', 'Cloudy', 'Rainy', 'Heavy Rain', 'Foggy/Misty', 'Snowy', 'Stormy', 'Windy'],
  locationType: ['Urban - City Street', 'Urban - Alley', 'Urban - Rooftop', 'Interior - Home', 'Interior - Office', 'Interior - Restaurant', 'Nature - Forest', 'Nature - Beach', 'Nature - Mountain', 'Nature - Desert', 'Sci-Fi - Spaceship', 'Sci-Fi - Alien Planet', 'Fantasy - Castle', 'Fantasy - Enchanted Forest', 'Post-Apocalyptic'],
  
  // Video
  camera: ['Static', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Zoom In', 'Zoom Out', 'Dolly Forward', 'Dolly Back', 'Orbit Left', 'Orbit Right', 'Crane Up', 'Crane Down', 'Tracking Shot', 'Drone Ascending', 'Drone Descending', 'Handheld'],
  speed: ['Slow Motion', 'Normal Speed', 'Fast/Timelapse'],
  duration: ['3 seconds', '5 seconds', '8 seconds', '10 seconds'],
  motionIntensity: ['Minimal', 'Subtle', 'Moderate', 'Dynamic', 'Dramatic'],
  shotType: ['ECU - Extreme Close-Up', 'CU - Close-Up', 'MCU - Medium Close-Up', 'MS - Medium Shot', 'MLS - Medium Long Shot', 'LS - Long Shot', 'ELS - Extreme Long Shot', 'OTS - Over The Shoulder', 'POV - Point of View', 'Two Shot', 'Wide Establishing'],
  cameraAngle: ['Eye Level', 'Low Angle', 'High Angle', 'Birds Eye', 'Worms Eye', 'Dutch Angle', 'Profile'],
  
  // Action & Dialogue
  actionType: ['Hand-to-Hand Combat', 'Sword/Melee Fight', 'Gun Fight', 'Car Chase', 'Foot Chase/Parkour', 'Explosion', 'Fall/Jump Stunt', 'Superhero Action', 'Dance/Choreographed'],
  speakingStyle: ['Normal Conversation', 'Whispering', 'Shouting', 'Emotional/Crying', 'Laughing', 'Angry', 'Nervous', 'Confident', 'Seductive', 'Excited'],
  headMovement: ['Minimal', 'Subtle Nods', 'Natural', 'Expressive', 'Shaking No', 'Nodding Yes'],
  eyeMovement: ['Looking at Camera', 'Looking Away', 'Looking Down', 'Looking Up', 'Shifting', 'Intense Stare', 'Blinking'],
  
  // Transition & Color
  transitionType: ['Morph/Transform', 'Match Cut', 'Whip Pan', 'Zoom Through', 'Light Flash', 'Dissolve', 'Fade to Black', 'Glitch', 'Smoke/Fog', 'Shatter'],
  colorPalette: ['Vibrant', 'Muted/Desaturated', 'Warm Tones', 'Cool Tones', 'Teal & Orange', 'Monochrome', 'Pastel', 'Neon', 'Earth Tones', 'High Contrast'],
  colorGrade: ['Natural', 'Teal & Orange', 'Warm/Golden', 'Cool/Blue', 'Desaturated', 'Vintage', 'Neon/Vibrant', 'Black & White'],
  
  // Poster
  posterStyle: ['Hollywood Blockbuster', 'Minimalist', 'Illustrated', 'Noir/Classic', 'Horror', 'Comedy', 'Romance', 'Action', 'Sci-Fi', 'Fantasy', 'Anime'],
  posterComposition: ['Character Centered', 'Silhouette', 'Floating Heads', 'Action Scene', 'Symbolic', 'Montage'],
  
  // Project
  projectType: ['Short Film', 'Feature Film', 'Web Series', 'Drama Series', 'Music Video', 'Commercial', 'Documentary', 'Animation'],
  genre: ['Drama', 'Thriller', 'Horror', 'Comedy', 'Romance', 'Action', 'Sci-Fi', 'Fantasy', 'Mystery', 'Adventure'],
  
  // Ideation
  platforms: ['YouTube', 'TikTok', 'Instagram Reels', 'Netflix', 'Amazon Prime', 'Disney+', 'Hulu', 'HBO Max', 'Apple TV+', 'Twitch', 'Facebook Watch'],
  contentCategory: ['Entertainment', 'Education', 'Documentary', 'News', 'Gaming', 'Lifestyle', 'Tech', 'Music', 'Sports', 'Comedy', 'Drama'],
  targetAudience: ['Gen Z (13-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57-75)', 'Family/All Ages', 'Young Adults', 'Teens', 'Kids'],
  regions: ['Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa', 'Southeast Asia'],
  timeframe: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year', 'All Time'],
  era: ['Contemporary', 'Near Future', 'Far Future', '1990s', '1980s', '1970s', '1960s', 'Victorian Era', 'Medieval', 'Ancient', 'Prehistoric', 'Alternate History'],
  
  // Story Development
  episodeLength: ['15 minutes', '22 minutes', '30 minutes', '45 minutes', '60 minutes', '90 minutes'],
  sceneDuration: ['30 seconds', '1 minute', '2 minutes', '3 minutes', '5 minutes', '10 minutes'],
  episodeCount: ['1 (Short Film)', '3 (Mini Series)', '6 (Limited Series)', '8 (Standard)', '10 (Full Season)', '12 (Extended)', '24 (Long Series)'],
  
  // Audio
  voiceType: ['Deep Male', 'Warm Male', 'Young Male', 'Deep Female', 'Warm Female', 'Young Female', 'Child', 'Elderly Male', 'Elderly Female', 'Robotic', 'Narrator'],
  accents: ['American', 'British', 'Australian', 'Irish', 'Scottish', 'French', 'German', 'Spanish', 'Italian', 'Japanese', 'Korean', 'Indian', 'Russian', 'Neutral'],
  speakingSpeed: ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'],
  sceneType: ['Action', 'Romance', 'Suspense', 'Horror', 'Comedy', 'Drama', 'Chase', 'Fight', 'Emotional', 'Montage', 'Flashback', 'Dream'],
  musicGenre: ['Orchestral', 'Electronic', 'Ambient', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Folk', 'World', 'Synthwave', 'Lo-Fi', 'Cinematic'],
  tempo: ['Very Slow (40-60 BPM)', 'Slow (60-80 BPM)', 'Moderate (80-100 BPM)', 'Upbeat (100-120 BPM)', 'Fast (120-140 BPM)', 'Very Fast (140+ BPM)'],
  audioDuration: ['15 seconds', '30 seconds', '1 minute', '2 minutes', '3 minutes', '5 minutes', '10 minutes'],
  sfxCategory: ['Ambient/Nature', 'Weather', 'Footsteps', 'Doors/Windows', 'Vehicles', 'Weapons', 'Impacts', 'Electronic', 'Crowd/People', 'Animals', 'Sci-Fi', 'Horror', 'UI/Interface'],
  audioEnvironment: ['Indoor Small', 'Indoor Large', 'Outdoor Open', 'Outdoor Urban', 'Underground', 'Underwater', 'Space', 'Forest', 'Desert', 'Mountain'],
  audioLevel: ['Silent', 'Very Low', 'Low', 'Medium', 'High', 'Very High', 'Dominant'],
  mixStyle: ['Dialogue Focus', 'Music Focus', 'Ambient Focus', 'Balanced', 'Dynamic', 'Minimalist'],
  
  // Post-Production
  pacing: ['Very Slow/Contemplative', 'Slow', 'Moderate', 'Fast', 'Very Fast/Frenetic', 'Variable'],
  clipLength: ['15 seconds', '30 seconds', '60 seconds', '90 seconds', '2 minutes', '3 minutes'],
  exportType: ['Full Episode', 'Scene', 'Clip', 'Trailer', 'Teaser', 'Behind the Scenes'],
  resolution: ['720p HD', '1080p Full HD', '2K', '4K UHD', '8K'],
  videoFormat: ['MP4 (H.264)', 'MP4 (H.265/HEVC)', 'MOV (ProRes)', 'WebM', 'AVI', 'MKV'],
  
  // Distribution
  editStyle: ['Fast Cuts', 'Smooth Transitions', 'Jump Cuts', 'Montage', 'Slow Motion Highlights', 'Text Heavy', 'Minimal'],
  trailerLength: ['15 seconds (Teaser)', '30 seconds (Short)', '60 seconds (Standard)', '90 seconds (Extended)', '2-3 minutes (Full)'],
  trailerType: ['Teaser', 'Theatrical', 'TV Spot', 'Character Spotlight', 'Behind the Scenes', 'Final Trailer'],
  socialPlatform: ['TikTok (9:16)', 'Instagram Reels (9:16)', 'YouTube Shorts (9:16)', 'YouTube (16:9)', 'Twitter/X (16:9)', 'Facebook (16:9)']
};


// ============ APP FORMS - INTEGRATED WITH AUTO-POPULATE ============
const APP_FORMS = {
  // ============ IDEATION PHASE ============
  'idea-01': {
    name: 'Trend Explorer',
    description: 'Discover viral trends to inspire your story',
    inputs: [
      { id: 'platform', type: 'select', label: 'Platform', options: 'platforms' },
      { id: 'category', type: 'select', label: 'Content Category', options: 'contentCategory' },
      { id: 'targetAudience', type: 'select', label: 'Target Audience', options: 'targetAudience' },
      { id: 'region', type: 'select', label: 'Region', options: 'regions' },
      { id: 'timeframe', type: 'select', label: 'Timeframe', options: 'timeframe' }
    ],
    promptTemplate: `Analyze current viral trends and content opportunities:

Platform: {platform}
Category: {category}
Target Audience: {targetAudience}
Region: {region}
Timeframe: {timeframe}

Provide:
1. Top 10 trending topics/themes with viral potential
2. Emerging storytelling formats
3. Content gap opportunities
4. Recommended story angles for each trend
5. Hashtag recommendations
6. Best posting times`
  },

  'idea-02': {
    name: 'Idea Generator',
    description: 'Generate unique story concepts',
    inputs: [
      { id: 'genre', type: 'select', label: 'Genre', options: 'genre' },
      { id: 'tone', type: 'select', label: 'Tone', options: 'mood' },
      { id: 'setting', type: 'select', label: 'Setting', options: 'locationType' },
      { id: 'targetAudience', type: 'select', label: 'Target Audience', options: 'targetAudience' },
      { id: 'theme', type: 'textarea', label: 'Theme/Message', placeholder: 'Redemption, love conquers all, coming of age...', rows: 2 },
      { id: 'constraints', type: 'textarea', label: 'Constraints', placeholder: 'Low budget, single location, 2 actors max...', rows: 2 }
    ],
    promptTemplate: `Generate 5 unique story concepts:

Genre: {genre}
Tone: {tone}
Setting: {setting}
Target Audience: {targetAudience}
Theme: {theme}
Constraints: {constraints}

For each concept provide:
- Title
- Logline (1 sentence)
- Synopsis (3-4 sentences)
- Main characters (name, role, brief description)
- Unique hook
- Viral potential score (1-10)
- Why it would work for the target audience`
  },

  'idea-03': {
    name: 'Genre Mixer',
    description: 'Combine genres for unique concepts',
    inputs: [
      { id: 'genre1', type: 'select', label: 'Primary Genre', options: 'genre' },
      { id: 'genre2', type: 'select', label: 'Secondary Genre', options: 'genre' },
      { id: 'era', type: 'select', label: 'Era/Period', options: 'era' },
      { id: 'uniqueElement', type: 'textarea', label: 'Unique Element', placeholder: 'Time loop, unreliable narrator, found footage...', rows: 2 }
    ],
    promptTemplate: `Create genre-blending story concepts:

Primary Genre: {genre1}
Secondary Genre: {genre2}
Era: {era}
Unique Element: {uniqueElement}

Generate 3 innovative concepts that blend these genres. Include:
- High concept pitch
- Why this combination works
- Target audience
- Comparable successful films/shows
- Full synopsis ready for development`
  },

  // ============ STORY DEVELOPMENT PHASE (CORE) ============
  'story-01': {
    name: 'Synopsis Writer',
    description: '⭐ CORE: Create master synopsis that auto-populates ALL production phases',
    isCore: true,
    inputs: [
      { id: 'title', type: 'text', label: 'Project Title', placeholder: 'The Last Detective' },
      { id: 'logline', type: 'textarea', label: 'Logline', placeholder: 'A one-sentence summary of your story...', rows: 2 },
      { id: 'genre', type: 'select', label: 'Genre', options: 'genre' },
      { id: 'projectType', type: 'select', label: 'Format', options: 'projectType' },
      { id: 'episodes', type: 'select', label: 'Number of Episodes', options: 'episodeCount' },
      { id: 'episodeLength', type: 'select', label: 'Episode Length', options: 'episodeLength' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles' },
      { id: 'mood', type: 'select', label: 'Overall Mood', options: 'mood' },
      { id: 'setting', type: 'textarea', label: 'Setting/World', placeholder: 'Neo-Tokyo, 2089, after the great flood...', rows: 2 },
      { id: 'themes', type: 'textarea', label: 'Themes', placeholder: 'Identity, redemption, found family...', rows: 2 },
      { id: 'synopsis', type: 'textarea', label: 'Full Synopsis', placeholder: 'Write your complete story synopsis here... This will auto-populate all production phases.', rows: 10 }
    ],
    promptTemplate: `Create a COMPLETE PRODUCTION BIBLE for:

TITLE: {title}
LOGLINE: {logline}
GENRE: {genre}
FORMAT: {projectType} - {episodes} x {episodeLength}
VISUAL STYLE: {style}
MOOD: {mood}
SETTING: {setting}
THEMES: {themes}

SYNOPSIS:
{synopsis}

Generate a comprehensive production bible including:

## 1. STORY OVERVIEW
- Expanded synopsis (500 words)
- Three-act structure breakdown
- Key plot points and twists
- Emotional journey map

## 2. CHARACTERS (for each main character)
- Name, Age, Gender
- Physical description (detailed for AI image generation)
- Costume/wardrobe description
- Personality traits
- Character arc (start → end)
- Key relationships
- Signature dialogue style

## 3. LOCATIONS (for each key location)
- Name and type
- Detailed visual description
- Time of day typically used
- Mood/atmosphere
- Key props

## 4. EPISODE BREAKDOWN
For each episode:
- Episode title
- Synopsis (100 words)
- Key scenes list
- Characters involved
- Locations used
- Emotional arc

## 5. SCENE LIST
For each scene:
- Scene number
- Location (INT/EXT)
- Time of day
- Characters present
- Brief action description
- Key dialogue snippets
- Mood/tone
- Suggested shots

## 6. PRODUCTION NOTES
- Visual style guide
- Color palette
- Lighting approach
- Music/audio direction

This will be used to auto-populate all production tools.`,
    outputFormat: 'production-bible'
  },

  'story-02': {
    name: 'Episode Breakdown',
    description: 'Auto-populated from Synopsis - split into episodes',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'synopsis', type: 'textarea', label: 'Story Synopsis', placeholder: '📋 Auto-filled from Synopsis Writer', rows: 6, autoFill: 'synopsis' },
      { id: 'episodeNumber', type: 'text', label: 'Episode Number', placeholder: '1' },
      { id: 'episodeTitle', type: 'text', label: 'Episode Title', placeholder: 'Pilot: The Beginning' },
      { id: 'focusCharacter', type: 'text', label: 'Focus Character', placeholder: 'Auto-filled from characters', autoFill: 'character' },
      { id: 'mainConflict', type: 'textarea', label: 'Main Conflict', placeholder: 'Auto-generated from synopsis', rows: 2 }
    ],
    promptTemplate: `Break down Episode {episodeNumber}: {episodeTitle}

SERIES SYNOPSIS:
{synopsis}

FOCUS CHARACTER: {focusCharacter}
MAIN CONFLICT: {mainConflict}

Generate detailed episode breakdown:
1. Cold open scene (hook)
2. Act 1 scenes (setup)
3. Act 2 scenes (confrontation)
4. Act 3 scenes (resolution/cliffhanger)
5. Scene-by-scene list with:
   - Scene number
   - Location (INT/EXT, place, time)
   - Characters present
   - Key action/dialogue
   - Emotional beat
   - Duration estimate
6. B-plot integration
7. Character development moments
8. Cliffhanger/hook for next episode`
  },

  'story-03': {
    name: 'Scene Planner',
    description: 'Auto-populated - detailed scene planning',
    autoPopulateFrom: 'story-02',
    inputs: [
      { id: 'episodeContext', type: 'textarea', label: 'Episode Context', placeholder: '📋 Auto-filled from Episode Breakdown', rows: 3, autoFill: 'episode' },
      { id: 'sceneNumber', type: 'text', label: 'Scene Number', placeholder: '1' },
      { id: 'location', type: 'text', label: 'Location', placeholder: 'INT. POLICE STATION - NIGHT', autoFill: 'location' },
      { id: 'characters', type: 'textarea', label: 'Characters in Scene', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'characters' },
      { id: 'objective', type: 'textarea', label: 'Scene Objective', placeholder: 'Auto-generated', rows: 2 },
      { id: 'emotion', type: 'select', label: 'Emotional Tone', options: 'mood' },
      { id: 'duration', type: 'select', label: 'Scene Duration', options: 'sceneDuration' }
    ],
    promptTemplate: `Plan Scene {sceneNumber} in detail:

EPISODE CONTEXT: {episodeContext}
LOCATION: {location}
CHARACTERS: {characters}
OBJECTIVE: {objective}
TONE: {emotion}
DURATION: {duration}

Generate:
1. Scene heading (INT/EXT, location, time)
2. Opening action/description
3. Full dialogue with subtext notes
4. Key beats and turning points
5. Visual suggestions:
   - Shot list (shot type, angle, movement)
   - Lighting setup
   - Color mood
6. Audio notes:
   - Dialogue delivery style
   - Background music mood
   - Sound effects needed
7. Transition to next scene
8. Props and set requirements`
  },

  'story-04': {
    name: 'Character Arc',
    description: 'Auto-populated - character journey mapping',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'characterName', type: 'text', label: 'Character Name', placeholder: '📋 Auto-filled', autoFill: 'character.name' },
      { id: 'role', type: 'select', label: 'Story Role', options: 'characterRole' },
      { id: 'physical', type: 'textarea', label: 'Physical Description', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'character.physical' },
      { id: 'startingPoint', type: 'textarea', label: 'Starting Point', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'character.start' },
      { id: 'endingPoint', type: 'textarea', label: 'Ending Point', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'character.end' },
      { id: 'flaw', type: 'textarea', label: 'Fatal Flaw', placeholder: 'Cannot forgive herself...', rows: 2 },
      { id: 'want', type: 'text', label: 'External Want', placeholder: 'Solve the case' },
      { id: 'need', type: 'text', label: 'Internal Need', placeholder: 'Self-forgiveness' }
    ],
    promptTemplate: `Design complete character arc for {characterName}:

ROLE: {role}
PHYSICAL: {physical}
STARTING POINT: {startingPoint}
ENDING POINT: {endingPoint}
FATAL FLAW: {flaw}
WANT: {want}
NEED: {need}

Generate:
1. Detailed character biography
2. Episode-by-episode arc progression
3. Key transformation moments
4. Relationships that drive change
5. Internal vs external conflict
6. Symbolic elements tied to arc
7. Dialogue evolution examples
8. Visual transformation notes (costume, posture, expression changes)`
  },


  // ============ PRE-PRODUCTION PHASE ============
  '01': {
    name: 'Script to Treatment',
    description: 'Auto-populated - convert synopsis to visual breakdown',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'script', type: 'textarea', label: 'Script/Synopsis', placeholder: '📋 Auto-filled from Synopsis Writer', rows: 8, autoFill: 'synopsis' },
      { id: 'projectType', type: 'select', label: 'Project Type', options: 'projectType', autoFill: 'projectType' },
      { id: 'genre', type: 'select', label: 'Genre', options: 'genre', autoFill: 'genre' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles', autoFill: 'style' },
      { id: 'mood', type: 'select', label: 'Overall Mood', options: 'mood', autoFill: 'mood' },
      { id: 'colorPalette', type: 'select', label: 'Color Direction', options: 'colorPalette' }
    ],
    promptTemplate: `Create comprehensive VISUAL TREATMENT:

STORY/SCRIPT:
{script}

Project Type: {projectType}
Genre: {genre}
Visual Style: {style}
Mood: {mood}
Color Direction: {colorPalette}

Provide detailed treatment including:
- Project Overview (title, logline, visual approach)
- Scene-by-Scene Visual Breakdown
- Character Visual Notes
- Shot List Suggestions
- Technical Recommendations
- Lighting Guide
- Color Palette Specifications`
  },

  '02': {
    name: 'Storyboard Creator',
    description: 'Auto-populated - generate storyboards per scene',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'shotDesc', type: 'textarea', label: 'Shot Description', placeholder: '📋 Auto-filled from Scene Planner', rows: 4, autoFill: 'scene.description' },
      { id: 'shotNumber', type: 'text', label: 'Shot Number', placeholder: '1' },
      { id: 'sceneHeading', type: 'text', label: 'Scene Heading', placeholder: '📋 Auto-filled', autoFill: 'scene.heading' },
      { id: 'shotType', type: 'select', label: 'Shot Type', options: 'shotType' },
      { id: 'cameraAngle', type: 'select', label: 'Camera Angle', options: 'cameraAngle' },
      { id: 'camera', type: 'select', label: 'Camera Movement', options: 'camera' },
      { id: 'style', type: 'select', label: 'Storyboard Style', options: 'styles', autoFill: 'style' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' },
      { id: 'action', type: 'text', label: 'Action Notes', placeholder: '📋 Auto-filled', autoFill: 'scene.action' },
      { id: 'dialogue', type: 'text', label: 'Dialogue', placeholder: '📋 Auto-filled', autoFill: 'scene.dialogue' }
    ],
    promptTemplate: `Generate storyboard frame:

Shot #{shotNumber} - {sceneHeading}

{shotDesc}

Shot Type: {shotType}
Camera Angle: {cameraAngle}
Camera Movement: {camera}
Aspect Ratio: {aspectRatio}

Action: {action}
Dialogue: {dialogue}

Style: {style} storyboard sketch, clear composition, professional storyboard panel format`
  },

  '03': {
    name: 'Character Designer',
    description: 'Auto-populated - design characters from synopsis data',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'name', type: 'text', label: 'Character Name', placeholder: '📋 Auto-filled', autoFill: 'character.name' },
      { id: 'role', type: 'select', label: 'Role', options: 'characterRole', autoFill: 'character.role' },
      { id: 'age', type: 'select', label: 'Age', options: 'age', autoFill: 'character.age' },
      { id: 'gender', type: 'select', label: 'Gender', options: 'gender', autoFill: 'character.gender' },
      { id: 'bodyType', type: 'select', label: 'Body Type', options: 'bodyType' },
      { id: 'physical', type: 'textarea', label: 'Physical Description', placeholder: '📋 Auto-filled from Synopsis', rows: 3, autoFill: 'character.physical' },
      { id: 'costume', type: 'textarea', label: 'Costume/Clothing', placeholder: '📋 Auto-filled', rows: 3, autoFill: 'character.costume' },
      { id: 'personality', type: 'text', label: 'Personality Traits', placeholder: '📋 Auto-filled', autoFill: 'character.personality' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'style', type: 'select', label: 'Art Style', options: 'styles', autoFill: 'style' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' }
    ],
    promptTemplate: `Character Design: {name}

{age} {gender}, {bodyType} build
{physical}

Wearing: {costume}

Expression: {expression}
Personality: {personality}

{style} style, {lighting} lighting, character portrait, highly detailed, professional character design sheet`,
    supportsOutputCount: true
  },

  '04': {
    name: 'World Builder',
    description: 'Auto-populated - design locations from synopsis',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'locationName', type: 'text', label: 'Location Name', placeholder: '📋 Auto-filled', autoFill: 'location.name' },
      { id: 'locationType', type: 'select', label: 'Location Type', options: 'locationType', autoFill: 'location.type' },
      { id: 'description', type: 'textarea', label: 'Description', placeholder: '📋 Auto-filled from Synopsis', rows: 4, autoFill: 'location.description' },
      { id: 'timeOfDay', type: 'select', label: 'Time of Day', options: 'timeOfDay' },
      { id: 'weather', type: 'select', label: 'Weather', options: 'weather' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles', autoFill: 'style' },
      { id: 'shotType', type: 'select', label: 'Shot Composition', options: 'shotType' }
    ],
    promptTemplate: `{locationType}: {locationName}

{description}

Time: {timeOfDay}, {weather}
Mood: {mood}
Lighting: {lighting}
Colors: {colorPalette}

{style} style, {shotType}, highly detailed environment design, cinematic composition`
  },

  // ============ PRODUCTION - IMAGE ============
  '05': {
    name: 'Text to Image Pro',
    description: 'Auto-populated - generate scene images',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'subject', type: 'textarea', label: 'Image Description', placeholder: '📋 Auto-filled from Scene', rows: 4, autoFill: 'scene.visual' },
      { id: 'style', type: 'select', label: 'Style', options: 'styles', autoFill: 'style' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'cameraAngle', type: 'select', label: 'Camera Angle', options: 'cameraAngle' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' },
      { id: 'negative', type: 'text', label: 'Avoid (optional)', placeholder: 'blurry, watermark, text...' }
    ],
    promptTemplate: `{subject}

{style} style, {lighting} lighting, {mood} atmosphere, {colorPalette} colors, {cameraAngle} angle, highly detailed, 8K quality

Avoid: {negative}`,
    supportsOutputCount: true
  },

  '06': {
    name: 'Character Transform',
    description: 'Transform character reference photos',
    inputs: [
      { id: 'transformation', type: 'textarea', label: 'Transformation Description', placeholder: 'Transform into character costume/look...', rows: 3 },
      { id: 'style', type: 'select', label: 'Output Style', options: 'styles', autoFill: 'style' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' }
    ],
    promptTemplate: `Transform the uploaded reference photo:

{transformation}

Output Style: {style}
Expression: {expression}
Lighting: {lighting}
Mood: {mood}

Maintain face similarity, highly detailed transformation`
  },

  '07': {
    name: 'Scene Generator',
    description: 'Auto-populated - generate scene backgrounds',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Scene Description', placeholder: '📋 Auto-filled from Scene', rows: 4, autoFill: 'scene.location' },
      { id: 'locationType', type: 'select', label: 'Location Type', options: 'locationType', autoFill: 'location.type' },
      { id: 'timeOfDay', type: 'select', label: 'Time of Day', options: 'timeOfDay', autoFill: 'scene.time' },
      { id: 'weather', type: 'select', label: 'Weather', options: 'weather' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Style', options: 'styles', autoFill: 'style' },
      { id: 'shotType', type: 'select', label: 'Shot Type', options: 'shotType' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: `Generate scene/background image:

Location: {locationType}

{description}

Time: {timeOfDay}
Weather: {weather}
Mood: {mood}
Lighting: {lighting}
Colors: {colorPalette}
Style: {style}
Shot Type: {shotType}
Aspect Ratio: {aspectRatio}

Highly detailed environment, cinematic composition, no characters`,
    supportsOutputCount: true
  },

  // ============ PRODUCTION - VIDEO ============
  '08': {
    name: 'Text to Video Pro',
    description: 'Auto-populated - generate scene videos (VEO 3)',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Video Scene Description', placeholder: '📋 Auto-filled from Scene', rows: 4, autoFill: 'scene.action' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles', autoFill: 'style' },
      { id: 'shotType', type: 'select', label: 'Shot Type', options: 'shotType' },
      { id: 'camera', type: 'select', label: 'Camera Movement', options: 'camera' },
      { id: 'speed', type: 'select', label: 'Motion Speed', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorGrade', type: 'select', label: 'Color Grade', options: 'colorGrade' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' },
      { id: 'negative', type: 'text', label: 'Avoid', placeholder: 'blurry, shaky, distorted...' }
    ],
    promptTemplate: `Generate cinematic video clip:

SCENE:
{description}

Style: {style}
Shot Type: {shotType}
Aspect Ratio: {aspectRatio}
Duration: {duration}
Camera Movement: {camera}
Motion Speed: {speed}
Lighting: {lighting}
Color Grade: {colorGrade}
Mood: {mood}

Negative: {negative}

Generate smooth, cinematic video suitable for film production.`,
    supportsOutputCount: true
  },

  '09': {
    name: 'Image to Video Pro',
    description: 'Animate scene images (VEO 3)',
    inputs: [
      { id: 'motion', type: 'textarea', label: 'Motion Description', placeholder: 'Describe the motion/animation...', rows: 3 },
      { id: 'motionIntensity', type: 'select', label: 'Motion Intensity', options: 'motionIntensity' },
      { id: 'camera', type: 'select', label: 'Camera Effect', options: 'camera' },
      { id: 'speed', type: 'select', label: 'Motion Speed', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'aspectRatio', type: 'select', label: 'Output Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: `Animate the uploaded image:

Motion: {motion}

Motion Intensity: {motionIntensity}
Camera Effect: {camera}
Speed: {speed}
Duration: {duration}
Output: {aspectRatio}

Smooth natural animation, maintain image quality, cinematic motion`,
    supportsOutputCount: true
  },

  '10': {
    name: 'Dialogue Animator',
    description: 'Auto-populated - animate character dialogue',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'dialogue', type: 'textarea', label: 'Dialogue Text', placeholder: '📋 Auto-filled from Scene', rows: 2, autoFill: 'scene.dialogue' },
      { id: 'speakingStyle', type: 'select', label: 'Speaking Style', options: 'speakingStyle' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'headMovement', type: 'select', label: 'Head Movement', options: 'headMovement' },
      { id: 'eyeMovement', type: 'select', label: 'Eye Movement', options: 'eyeMovement' },
      { id: 'motionIntensity', type: 'select', label: 'Lip Sync Intensity', options: 'motionIntensity' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' }
    ],
    promptTemplate: `Animate character speaking:

Dialogue: "{dialogue}"

Speaking Style: {speakingStyle}
Expression: {expression}
Head Movement: {headMovement}
Eye Movement: {eyeMovement}
Lip Sync: {motionIntensity}
Duration: {duration}

Natural talking animation, realistic lip sync`
  },

  '11': {
    name: 'Action Sequence',
    description: 'Auto-populated - generate action scenes',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Action Description', placeholder: '📋 Auto-filled from Scene', rows: 4, autoFill: 'scene.action' },
      { id: 'actionType', type: 'select', label: 'Action Type', options: 'actionType' },
      { id: 'motionIntensity', type: 'select', label: 'Intensity', options: 'motionIntensity' },
      { id: 'speed', type: 'select', label: 'Speed', options: 'speed' },
      { id: 'camera', type: 'select', label: 'Camera Style', options: 'camera' },
      { id: 'shotType', type: 'select', label: 'Shot Type', options: 'shotType' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles', autoFill: 'style' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: `Generate action sequence video:

Action Type: {actionType}

{description}

Intensity: {motionIntensity}
Speed: {speed}
Camera: {camera}
Shot Type: {shotType}
Lighting: {lighting}
Style: {style}
Duration: {duration}
Aspect Ratio: {aspectRatio}

Dynamic action, debris and effects, cinematic quality`,
    supportsOutputCount: true
  },


  // ============ PRODUCTION - AUDIO ============
  'audio-01': {
    name: 'Dialogue Generator',
    description: 'Auto-populated - generate character voice lines',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'character', type: 'text', label: 'Character Name', placeholder: '📋 Auto-filled', autoFill: 'character.name' },
      { id: 'voiceType', type: 'select', label: 'Voice Type', options: 'voiceType' },
      { id: 'emotion', type: 'select', label: 'Emotion', options: 'expression' },
      { id: 'dialogue', type: 'textarea', label: 'Dialogue Text', placeholder: '📋 Auto-filled from Scene', rows: 4, autoFill: 'scene.dialogue' },
      { id: 'context', type: 'textarea', label: 'Scene Context', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'scene.context' },
      { id: 'accent', type: 'select', label: 'Accent', options: 'accents' },
      { id: 'speed', type: 'select', label: 'Speaking Speed', options: 'speakingSpeed' }
    ],
    promptTemplate: `Generate voice dialogue:

Character: {character}
Voice Type: {voiceType}
Emotion: {emotion}
Accent: {accent}
Speed: {speed}

Dialogue:
"{dialogue}"

Context: {context}

Generate natural, emotionally authentic voice performance with appropriate pauses, emphasis, and breathing.`
  },

  'audio-02': {
    name: 'Background Music',
    description: 'Auto-populated - generate scene music',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'sceneType', type: 'select', label: 'Scene Type', options: 'sceneType', autoFill: 'scene.type' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'genre', type: 'select', label: 'Music Genre', options: 'musicGenre' },
      { id: 'tempo', type: 'select', label: 'Tempo', options: 'tempo' },
      { id: 'instruments', type: 'textarea', label: 'Key Instruments', placeholder: 'Piano, strings, synth pads...', rows: 2 },
      { id: 'duration', type: 'select', label: 'Duration', options: 'audioDuration' },
      { id: 'reference', type: 'textarea', label: 'Reference (optional)', placeholder: 'Similar to Hans Zimmer Interstellar...', rows: 2 }
    ],
    promptTemplate: `Generate background music:

Scene Type: {sceneType}
Mood: {mood}
Genre: {genre}
Tempo: {tempo}
Instruments: {instruments}
Duration: {duration}
Reference: {reference}

Create cinematic background music that enhances the emotional impact of the scene. Include dynamic progression and appropriate crescendos/diminuendos.`
  },

  'audio-03': {
    name: 'Sound Effects',
    description: 'Auto-populated - generate scene SFX',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'sfxType', type: 'select', label: 'SFX Category', options: 'sfxCategory' },
      { id: 'description', type: 'textarea', label: 'Sound Description', placeholder: '📋 Auto-filled from Scene', rows: 3, autoFill: 'scene.sfx' },
      { id: 'intensity', type: 'select', label: 'Intensity', options: 'motionIntensity' },
      { id: 'environment', type: 'select', label: 'Environment', options: 'audioEnvironment' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'audioDuration' }
    ],
    promptTemplate: `Generate sound effect:

Category: {sfxType}
Description: {description}
Intensity: {intensity}
Environment: {environment}
Duration: {duration}

Create realistic, high-quality sound effect suitable for film/video production.`
  },

  'audio-04': {
    name: 'Audio Mixer',
    description: 'Mix all audio layers for scene',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'dialogueLevel', type: 'select', label: 'Dialogue Level', options: 'audioLevel' },
      { id: 'musicLevel', type: 'select', label: 'Music Level', options: 'audioLevel' },
      { id: 'sfxLevel', type: 'select', label: 'SFX Level', options: 'audioLevel' },
      { id: 'ambientLevel', type: 'select', label: 'Ambient Level', options: 'audioLevel' },
      { id: 'sceneDescription', type: 'textarea', label: 'Scene Description', placeholder: '📋 Auto-filled', rows: 3, autoFill: 'scene.description' },
      { id: 'mixStyle', type: 'select', label: 'Mix Style', options: 'mixStyle' }
    ],
    promptTemplate: `Create audio mix guide:

Dialogue: {dialogueLevel}
Music: {musicLevel}
SFX: {sfxLevel}
Ambient: {ambientLevel}
Mix Style: {mixStyle}

Scene: {sceneDescription}

Provide detailed mixing instructions including:
1. Level automation over time
2. EQ suggestions
3. Compression settings
4. Spatial positioning
5. Transition points`
  },

  // ============ POST-PRODUCTION ============
  '12': {
    name: 'Video Extender',
    description: 'Extend video clips seamlessly',
    inputs: [
      { id: 'originalDesc', type: 'textarea', label: 'Original Scene Description', placeholder: 'Describe the original video scene...', rows: 3 },
      { id: 'continuation', type: 'textarea', label: 'What Happens Next', placeholder: 'She continues walking, then stops and turns...', rows: 3 },
      { id: 'camera', type: 'select', label: 'Camera Behavior', options: 'camera' },
      { id: 'speed', type: 'select', label: 'Pacing', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Extension Length', options: 'duration' }
    ],
    promptTemplate: `Extend this video scene:

Original: {originalDesc}

Continuation: {continuation}

Camera: {camera}
Pacing: {speed}
Extension: {duration}

Seamless continuation, match original style and lighting`
  },

  '13': {
    name: 'Transition Maker',
    description: 'Auto-populated - create scene transitions',
    autoPopulateFrom: 'story-03',
    inputs: [
      { id: 'sceneA', type: 'textarea', label: 'Scene A (From)', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'scene.current' },
      { id: 'sceneB', type: 'textarea', label: 'Scene B (To)', placeholder: '📋 Auto-filled', rows: 2, autoFill: 'scene.next' },
      { id: 'transitionType', type: 'select', label: 'Transition Type', options: 'transitionType' },
      { id: 'mood', type: 'select', label: 'Transition Mood', options: 'mood', autoFill: 'mood' },
      { id: 'speed', type: 'select', label: 'Speed', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' }
    ],
    promptTemplate: `Create transition between scenes:

Scene A: {sceneA}
Scene B: {sceneB}

Transition Type: {transitionType}
Mood: {mood}
Speed: {speed}
Duration: {duration}

Smooth creative transition, cinematic`
  },

  '14': {
    name: 'Color Mood Matcher',
    description: 'Match colors across all scenes',
    inputs: [
      { id: 'targetDesc', type: 'textarea', label: 'Image to Transform', placeholder: 'Describe the image...', rows: 2 },
      { id: 'referenceDesc', type: 'textarea', label: 'Reference Look', placeholder: 'Describe the color/mood to match...', rows: 2 },
      { id: 'colorGrade', type: 'select', label: 'Target Color Grade', options: 'colorGrade' },
      { id: 'mood', type: 'select', label: 'Target Mood', options: 'mood', autoFill: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting Style', options: 'lighting' }
    ],
    promptTemplate: `Color match this image:

Target: {targetDesc}
Reference Look: {referenceDesc}

Color Grade: {colorGrade}
Mood: {mood}
Lighting: {lighting}

Match colors and atmosphere while preserving content`
  },

  'post-01': {
    name: 'Scene Assembler',
    description: 'Auto-populated - combine scenes into episodes',
    autoPopulateFrom: 'story-02',
    inputs: [
      { id: 'episodeNumber', type: 'text', label: 'Episode Number', placeholder: '📋 Auto-filled', autoFill: 'episode.number' },
      { id: 'sceneList', type: 'textarea', label: 'Scene List', placeholder: '📋 Auto-filled from Episode Breakdown', rows: 6, autoFill: 'episode.scenes' },
      { id: 'pacing', type: 'select', label: 'Overall Pacing', options: 'pacing' },
      { id: 'totalDuration', type: 'text', label: 'Target Duration', placeholder: '📋 Auto-filled', autoFill: 'episode.duration' }
    ],
    promptTemplate: `Assemble Episode {episodeNumber}:

Scenes:
{sceneList}

Pacing: {pacing}
Target Duration: {totalDuration}

Provide:
1. Optimal scene order
2. Transition recommendations between scenes
3. Pacing adjustments
4. Cut points for each scene
5. Music cue placement
6. Title card/credits timing`
  },

  'post-02': {
    name: 'Viral Picker',
    description: 'AI picks viral-worthy moments from episodes',
    autoPopulateFrom: 'story-02',
    inputs: [
      { id: 'content', type: 'textarea', label: 'Episode/Scene Description', placeholder: '📋 Auto-filled from Episode', rows: 6, autoFill: 'episode.synopsis' },
      { id: 'platform', type: 'select', label: 'Target Platform', options: 'platforms' },
      { id: 'clipLength', type: 'select', label: 'Clip Length', options: 'clipLength' }
    ],
    promptTemplate: `Analyze for viral potential:

Content:
{content}

Platform: {platform}
Clip Length: {clipLength}

Identify:
1. Top 5 viral-worthy moments with timestamps
2. Why each moment has viral potential
3. Suggested captions/hooks
4. Best thumbnail frames
5. Hashtag recommendations
6. Posting time suggestions
7. Engagement prediction score`
  },

  'post-03': {
    name: 'Export Manager',
    description: 'Export all formats for all platforms',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'projectName', type: 'text', label: 'Project Name', placeholder: '📋 Auto-filled', autoFill: 'title' },
      { id: 'exportType', type: 'select', label: 'Export Type', options: 'exportType' },
      { id: 'resolution', type: 'select', label: 'Resolution', options: 'resolution' },
      { id: 'format', type: 'select', label: 'Format', options: 'videoFormat' },
      { id: 'platform', type: 'select', label: 'Destination Platform', options: 'platforms' }
    ],
    promptTemplate: `Export settings for {projectName}:

Type: {exportType}
Resolution: {resolution}
Format: {format}
Platform: {platform}

Provide:
1. Optimal export settings
2. Codec recommendations
3. Bitrate suggestions
4. Audio format
5. Metadata requirements
6. File naming convention
7. Platform-specific requirements`
  },

  // ============ DISTRIBUTION ============
  '15': {
    name: 'Thumbnail Generator',
    description: 'Auto-generate thumbnails from key scenes',
    autoPopulateFrom: 'story-02',
    inputs: [
      { id: 'concept', type: 'textarea', label: 'Thumbnail Concept', placeholder: '📋 Auto-suggested from viral moments', rows: 3, autoFill: 'viral.thumbnail' },
      { id: 'expression', type: 'select', label: 'Expression (if face)', options: 'expression' },
      { id: 'colorPalette', type: 'select', label: 'Color Scheme', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Style', options: 'styles', autoFill: 'style' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' }
    ],
    promptTemplate: `YouTube Thumbnail:

{concept}

Expression: {expression}
Colors: {colorPalette}
Style: {style}
Mood: {mood}

16:9, eye-catching, high contrast, click-worthy thumbnail`
  },

  '16': {
    name: 'Poster & Promo',
    description: 'Auto-populated - create posters from synopsis',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'title', type: 'text', label: 'Project Title', placeholder: '📋 Auto-filled', autoFill: 'title' },
      { id: 'tagline', type: 'text', label: 'Tagline', placeholder: '📋 Auto-generated', autoFill: 'tagline' },
      { id: 'concept', type: 'textarea', label: 'Poster Concept', placeholder: '📋 Auto-suggested from synopsis', rows: 4, autoFill: 'poster.concept' },
      { id: 'posterStyle', type: 'select', label: 'Poster Style', options: 'posterStyle' },
      { id: 'posterComposition', type: 'select', label: 'Composition', options: 'posterComposition' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' }
    ],
    promptTemplate: `Movie Poster: {title}
Tagline: {tagline}

{concept}

Style: {posterStyle}
Composition: {posterComposition}
Colors: {colorPalette}
Mood: {mood}

Professional movie poster, space for title at bottom, cinematic, highly detailed`
  },

  'dist-01': {
    name: 'Social Clips',
    description: 'Auto-populated - create viral short clips',
    autoPopulateFrom: 'post-02',
    inputs: [
      { id: 'sourceContent', type: 'textarea', label: 'Source Content', placeholder: '📋 Auto-filled from Viral Picker', rows: 4, autoFill: 'viral.moments' },
      { id: 'platform', type: 'select', label: 'Platform', options: 'socialPlatform' },
      { id: 'clipCount', type: 'text', label: 'Number of Clips', placeholder: '5' },
      { id: 'style', type: 'select', label: 'Edit Style', options: 'editStyle' }
    ],
    promptTemplate: `Create social media clips:

Source: {sourceContent}
Platform: {platform}
Clips Needed: {clipCount}
Style: {style}

For each clip provide:
1. Start/end points
2. Hook (first 3 seconds)
3. Caption text
4. On-screen text suggestions
5. Music/sound recommendations
6. Hashtags
7. Best posting time`
  },

  'dist-02': {
    name: 'Trailer Maker',
    description: 'Auto-populated - generate trailers from synopsis',
    autoPopulateFrom: 'story-01',
    inputs: [
      { id: 'synopsis', type: 'textarea', label: 'Full Synopsis', placeholder: '📋 Auto-filled from Synopsis Writer', rows: 6, autoFill: 'synopsis' },
      { id: 'trailerLength', type: 'select', label: 'Trailer Length', options: 'trailerLength' },
      { id: 'trailerType', type: 'select', label: 'Trailer Type', options: 'trailerType' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood', autoFill: 'mood' },
      { id: 'targetAudience', type: 'select', label: 'Target Audience', options: 'targetAudience' }
    ],
    promptTemplate: `Create trailer for:

{synopsis}

Length: {trailerLength}
Type: {trailerType}
Mood: {mood}
Audience: {targetAudience}

Provide:
1. Shot-by-shot breakdown
2. Dialogue/voiceover selections
3. Music cue points
4. Text card content
5. Pacing guide
6. Final hook/call-to-action
7. Thumbnail suggestion`
  }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_OPAL_LINKS, PHASES, OPTIONS, APP_FORMS };
}
