// AI Filmmaking Studio - Data & Options

const PHASES = [
  {
    id: 'pre-production',
    name: 'Pre-Production',
    icon: '📝',
    color: 'purple',
    apps: [
      { id: '01', name: 'Script to Treatment', icon: '📝', desc: 'Convert script to visual breakdown' },
      { id: '02', name: 'Storyboard Creator', icon: '📋', desc: 'Create visual storyboard frames' },
      { id: '03', name: 'Character Designer', icon: '👤', desc: 'Design characters from description' },
      { id: '04', name: 'World Builder', icon: '🌍', desc: 'Design locations and environments' }
    ]
  },
  {
    id: 'production-image',
    name: 'Production - Image',
    icon: '🎨',
    color: 'blue',
    apps: [
      { id: '05', name: 'Text to Image Pro', icon: '🎨', desc: 'Generate images from text' },
      { id: '06', name: 'Character Transform', icon: '🔄', desc: 'Transform photos (Whisk-style)' },
      { id: '07', name: 'Scene Generator', icon: '🎭', desc: 'Generate backgrounds & scenes' }
    ]
  },
  {
    id: 'production-video',
    name: 'Production - Video',
    icon: '🎬',
    color: 'pink',
    apps: [
      { id: '08', name: 'Text to Video Pro', icon: '🎬', desc: 'Generate video from text (VEO 3)' },
      { id: '09', name: 'Image to Video Pro', icon: '✨', desc: 'Animate images (VEO 3)' },
      { id: '10', name: 'Dialogue Animator', icon: '🗣️', desc: 'Animate talking characters' },
      { id: '11', name: 'Action Sequence', icon: '⚔️', desc: 'Generate action scenes' }
    ]
  },
  {
    id: 'post-production',
    name: 'Post-Production',
    icon: '🎞️',
    color: 'green',
    apps: [
      { id: '12', name: 'Video Extender', icon: '➕', desc: 'Extend video clips' },
      { id: '13', name: 'Transition Maker', icon: '🔀', desc: 'Create scene transitions' },
      { id: '14', name: 'Color Mood Matcher', icon: '🎨', desc: 'Match colors across scenes' }
    ]
  },
  {
    id: 'distribution',
    name: 'Distribution',
    icon: '📢',
    color: 'orange',
    apps: [
      { id: '15', name: 'Thumbnail Generator', icon: '🖼️', desc: 'Create thumbnails & covers' },
      { id: '16', name: 'Poster & Promo', icon: '🎬', desc: 'Create posters & promo materials' }
    ]
  }
];


// Dropdown Options for all apps
const OPTIONS = {
  // Common
  styles: ['Photorealistic', 'Cinematic', 'Anime/Manga', 'Digital Art', 'Oil Painting', 'Watercolor', 'Concept Art', 'Fantasy Art', 'Comic Book', 'Minimalist', 'Vintage/Retro', '3D Render', 'Sketch'],
  lighting: ['Natural Daylight', 'Golden Hour', 'Blue Hour', 'Studio Lighting', 'Dramatic Side Light', 'Soft/Diffused', 'Neon/Cyberpunk', 'Backlit/Silhouette', 'Moonlight', 'Candlelight', 'Overcast', 'High Key', 'Low Key'],
  mood: ['Epic/Grand', 'Mysterious', 'Tense/Suspenseful', 'Romantic', 'Melancholic', 'Action/Intense', 'Peaceful/Serene', 'Horror/Dark', 'Cheerful', 'Nostalgic', 'Dreamy', 'Chaotic'],
  aspectRatio: ['16:9 Landscape', '9:16 Portrait', '1:1 Square', '21:9 Cinematic', '4:3 Classic', '2.39:1 Anamorphic'],
  
  // Character specific
  gender: ['Male', 'Female', 'Androgynous', 'Non-binary'],
  age: ['Child (5-12)', 'Teen (13-19)', 'Young Adult (20-30)', 'Adult (30-45)', 'Middle Age (45-60)', 'Elder (60+)'],
  expression: ['Neutral', 'Happy/Smiling', 'Sad/Tearful', 'Angry/Furious', 'Surprised', 'Scared', 'Determined', 'Confused', 'Loving', 'Mischievous', 'Contempt'],
  bodyType: ['Slim/Lean', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Petite', 'Tall/Lanky', 'Heavy'],
  characterRole: ['Protagonist', 'Antagonist', 'Supporting', 'Love Interest', 'Mentor', 'Comic Relief', 'Mysterious Stranger'],
  
  // Scene specific
  timeOfDay: ['Dawn', 'Morning', 'Midday', 'Afternoon', 'Golden Hour', 'Sunset', 'Blue Hour', 'Night', 'Midnight'],
  weather: ['Clear/Sunny', 'Cloudy', 'Rainy', 'Heavy Rain', 'Foggy/Misty', 'Snowy', 'Stormy', 'Windy'],
  locationType: ['Urban - City Street', 'Urban - Alley', 'Urban - Rooftop', 'Interior - Home', 'Interior - Office', 'Interior - Restaurant', 'Nature - Forest', 'Nature - Beach', 'Nature - Mountain', 'Nature - Desert', 'Sci-Fi - Spaceship', 'Sci-Fi - Alien Planet', 'Fantasy - Castle', 'Fantasy - Enchanted Forest', 'Post-Apocalyptic'],
  
  // Video specific
  camera: ['Static', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Zoom In', 'Zoom Out', 'Dolly Forward', 'Dolly Back', 'Orbit Left', 'Orbit Right', 'Crane Up', 'Crane Down', 'Tracking Shot', 'Drone Ascending', 'Drone Descending', 'Handheld'],
  speed: ['Slow Motion', 'Normal Speed', 'Fast/Timelapse'],
  duration: ['3 seconds', '5 seconds', '8 seconds', '10 seconds'],
  motionIntensity: ['Minimal', 'Subtle', 'Moderate', 'Dynamic', 'Dramatic'],
  
  // Shot types
  shotType: ['ECU - Extreme Close-Up', 'CU - Close-Up', 'MCU - Medium Close-Up', 'MS - Medium Shot', 'MLS - Medium Long Shot', 'LS - Long Shot', 'ELS - Extreme Long Shot', 'OTS - Over The Shoulder', 'POV - Point of View', 'Two Shot', 'Wide Establishing'],
  cameraAngle: ['Eye Level', 'Low Angle', 'High Angle', 'Birds Eye', 'Worms Eye', 'Dutch Angle', 'Profile'],
  
  // Action specific
  actionType: ['Hand-to-Hand Combat', 'Sword/Melee Fight', 'Gun Fight', 'Car Chase', 'Foot Chase/Parkour', 'Explosion', 'Fall/Jump Stunt', 'Superhero Action', 'Dance/Choreographed'],
  
  // Dialogue specific
  speakingStyle: ['Normal Conversation', 'Whispering', 'Shouting', 'Emotional/Crying', 'Laughing', 'Angry', 'Nervous', 'Confident', 'Seductive', 'Excited'],
  headMovement: ['Minimal', 'Subtle Nods', 'Natural', 'Expressive', 'Shaking No', 'Nodding Yes'],
  eyeMovement: ['Looking at Camera', 'Looking Away', 'Looking Down', 'Looking Up', 'Shifting', 'Intense Stare', 'Blinking'],
  
  // Transition specific
  transitionType: ['Morph/Transform', 'Match Cut', 'Whip Pan', 'Zoom Through', 'Light Flash', 'Dissolve', 'Fade to Black', 'Glitch', 'Smoke/Fog', 'Shatter'],
  
  // Poster specific
  posterStyle: ['Hollywood Blockbuster', 'Minimalist', 'Illustrated', 'Noir/Classic', 'Horror', 'Comedy', 'Romance', 'Action', 'Sci-Fi', 'Fantasy', 'Anime'],
  posterComposition: ['Character Centered', 'Silhouette', 'Floating Heads', 'Action Scene', 'Symbolic', 'Montage'],
  
  // Color
  colorPalette: ['Vibrant', 'Muted/Desaturated', 'Warm Tones', 'Cool Tones', 'Teal & Orange', 'Monochrome', 'Pastel', 'Neon', 'Earth Tones', 'High Contrast'],
  colorGrade: ['Natural', 'Teal & Orange', 'Warm/Golden', 'Cool/Blue', 'Desaturated', 'Vintage', 'Neon/Vibrant', 'Black & White'],
  
  // Project types
  projectType: ['Short Film', 'Feature Film', 'Web Series', 'Drama Series', 'Music Video', 'Commercial', 'Documentary', 'Animation'],
  genre: ['Drama', 'Thriller', 'Horror', 'Comedy', 'Romance', 'Action', 'Sci-Fi', 'Fantasy', 'Mystery', 'Adventure']
};


// App Form Configurations - defines what inputs each app needs
const APP_FORMS = {
  '01': { // Script to Treatment
    name: 'Script to Treatment',
    inputs: [
      { id: 'script', type: 'textarea', label: 'Script or Story Idea', placeholder: 'Paste your script or describe your story...', rows: 8 },
      { id: 'projectType', type: 'select', label: 'Project Type', options: 'projectType' },
      { id: 'genre', type: 'select', label: 'Genre', options: 'genre' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles' },
      { id: 'mood', type: 'select', label: 'Overall Mood', options: 'mood' },
      { id: 'colorPalette', type: 'select', label: 'Color Direction', options: 'colorPalette' }
    ],
    promptTemplate: 'Analyze this script/story and create a visual treatment:\n\n{script}\n\nProject Type: {projectType}\nGenre: {genre}\nVisual Style: {style}\nMood: {mood}\nColor Direction: {colorPalette}\n\nProvide: Scene breakdown, character notes, shot suggestions, lighting/color notes for each scene.'
  },
  
  '02': { // Storyboard Creator
    name: 'Storyboard Creator',
    inputs: [
      { id: 'shotDesc', type: 'textarea', label: 'Shot Description', placeholder: 'INT. COFFEE SHOP - DAY. Close-up of Maya looking worried...', rows: 4 },
      { id: 'shotNumber', type: 'text', label: 'Shot Number', placeholder: '1' },
      { id: 'sceneHeading', type: 'text', label: 'Scene Heading', placeholder: 'INT. COFFEE SHOP - DAY' },
      { id: 'shotType', type: 'select', label: 'Shot Type', options: 'shotType' },
      { id: 'cameraAngle', type: 'select', label: 'Camera Angle', options: 'cameraAngle' },
      { id: 'camera', type: 'select', label: 'Camera Movement', options: 'camera' },
      { id: 'style', type: 'select', label: 'Storyboard Style', options: 'styles' },
      { id: 'action', type: 'text', label: 'Action Notes', placeholder: 'Maya turns toward the door...' },
      { id: 'dialogue', type: 'text', label: 'Dialogue (optional)', placeholder: 'MAYA: I knew you would come...' }
    ],
    promptTemplate: 'Create a storyboard frame:\n\nShot #{shotNumber}: {sceneHeading}\n{shotDesc}\n\nShot Type: {shotType}\nCamera Angle: {cameraAngle}\nCamera Movement: {camera}\nAction: {action}\nDialogue: {dialogue}\n\nStyle: {style} storyboard sketch, clear composition, professional storyboard format'
  },
  
  '03': { // Character Designer
    name: 'Character Designer',
    inputs: [
      { id: 'name', type: 'text', label: 'Character Name', placeholder: 'Maya Chen' },
      { id: 'role', type: 'select', label: 'Role', options: 'characterRole' },
      { id: 'age', type: 'select', label: 'Age', options: 'age' },
      { id: 'gender', type: 'select', label: 'Gender', options: 'gender' },
      { id: 'bodyType', type: 'select', label: 'Body Type', options: 'bodyType' },
      { id: 'physical', type: 'textarea', label: 'Physical Description', placeholder: 'Short black hair, brown eyes, small scar on eyebrow...', rows: 3 },
      { id: 'costume', type: 'textarea', label: 'Costume/Clothing', placeholder: 'Dark leather jacket, white t-shirt, black jeans...', rows: 3 },
      { id: 'personality', type: 'text', label: 'Personality Traits', placeholder: 'Determined, analytical, guarded' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'style', type: 'select', label: 'Art Style', options: 'styles' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' }
    ],
    promptTemplate: 'Character Design: {name}\n\n{age} {gender}, {bodyType} build\n{physical}\n\nWearing: {costume}\n\nExpression: {expression}\nPersonality: {personality}\n\n{style} style, {lighting} lighting, character portrait, highly detailed, professional character design sheet'
  },
  
  '04': { // World Builder
    name: 'World Builder',
    inputs: [
      { id: 'locationName', type: 'text', label: 'Location Name', placeholder: "Maya's Apartment" },
      { id: 'locationType', type: 'select', label: 'Location Type', options: 'locationType' },
      { id: 'description', type: 'textarea', label: 'Description', placeholder: 'A cramped detective apartment with case files on walls...', rows: 4 },
      { id: 'timeOfDay', type: 'select', label: 'Time of Day', options: 'timeOfDay' },
      { id: 'weather', type: 'select', label: 'Weather', options: 'weather' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles' },
      { id: 'shotType', type: 'select', label: 'Shot Composition', options: 'shotType' }
    ],
    promptTemplate: '{locationType}: {locationName}\n\n{description}\n\nTime: {timeOfDay}, {weather}\nMood: {mood}\nLighting: {lighting}\nColors: {colorPalette}\n\n{style} style, {shotType}, highly detailed environment design, cinematic composition'
  },

  '05': { // Text to Image Pro
    name: 'Text to Image Pro',
    inputs: [
      { id: 'subject', type: 'textarea', label: 'Image Description', placeholder: 'A samurai warrior standing on a cliff at sunset...', rows: 4 },
      { id: 'style', type: 'select', label: 'Style', options: 'styles' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'cameraAngle', type: 'select', label: 'Camera Angle', options: 'cameraAngle' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' },
      { id: 'negative', type: 'text', label: 'Avoid (optional)', placeholder: 'blurry, watermark, text...' }
    ],
    promptTemplate: '{subject}\n\n{style} style, {lighting} lighting, {mood} atmosphere, {colorPalette} colors, {cameraAngle} angle, highly detailed, 8K quality\n\nAvoid: {negative}'
  },
  
  '06': { // Character Transform
    name: 'Character Transform',
    inputs: [
      { id: 'transformation', type: 'textarea', label: 'Transformation Description', placeholder: 'Transform into a cyberpunk warrior with neon armor...', rows: 3 },
      { id: 'style', type: 'select', label: 'Output Style', options: 'styles' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' }
    ],
    promptTemplate: 'Transform the uploaded reference photo:\n\n{transformation}\n\nOutput Style: {style}\nExpression: {expression}\nLighting: {lighting}\nMood: {mood}\n\nMaintain face similarity, highly detailed transformation'
  },
  
  '07': { // Scene Generator
    name: 'Scene Generator',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Scene Description', placeholder: 'A cyberpunk city street at night with neon signs...', rows: 4 },
      { id: 'locationType', type: 'select', label: 'Location Type', options: 'locationType' },
      { id: 'timeOfDay', type: 'select', label: 'Time of Day', options: 'timeOfDay' },
      { id: 'weather', type: 'select', label: 'Weather', options: 'weather' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Style', options: 'styles' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: '{locationType}\n\n{description}\n\n{timeOfDay}, {weather}\n{mood} atmosphere, {lighting} lighting, {colorPalette} colors\n\n{style} style, {aspectRatio}, wide establishing shot, highly detailed, cinematic'
  },
  
  '08': { // Text to Video Pro
    name: 'Text to Video Pro',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Video Scene Description', placeholder: 'A woman walks through neon-lit Tokyo streets at night...', rows: 4 },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles' },
      { id: 'camera', type: 'select', label: 'Camera Movement', options: 'camera' },
      { id: 'speed', type: 'select', label: 'Motion Speed', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'colorGrade', type: 'select', label: 'Color Grade', options: 'colorGrade' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: '{description}\n\nCamera: {camera}\nSpeed: {speed}\nDuration: {duration}\n\n{style} style, {mood} atmosphere, {lighting} lighting, {colorGrade} color grade\n\n{aspectRatio}, cinematic video, smooth motion'
  },
  
  '09': { // Image to Video Pro
    name: 'Image to Video Pro',
    inputs: [
      { id: 'motion', type: 'textarea', label: 'Motion Description', placeholder: 'Person slowly smiles, hair flows in wind...', rows: 3 },
      { id: 'motionIntensity', type: 'select', label: 'Motion Intensity', options: 'motionIntensity' },
      { id: 'camera', type: 'select', label: 'Camera Effect', options: 'camera' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'aspectRatio', type: 'select', label: 'Output Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: 'Animate the uploaded image:\n\n{motion}\n\nMotion Intensity: {motionIntensity}\nCamera Effect: {camera}\nDuration: {duration}\nOutput: {aspectRatio}\n\nSmooth natural animation, maintain image quality'
  },
  
  '10': { // Dialogue Animator
    name: 'Dialogue Animator',
    inputs: [
      { id: 'dialogue', type: 'textarea', label: 'Dialogue Text', placeholder: 'What the character is saying...', rows: 2 },
      { id: 'speakingStyle', type: 'select', label: 'Speaking Style', options: 'speakingStyle' },
      { id: 'expression', type: 'select', label: 'Expression', options: 'expression' },
      { id: 'headMovement', type: 'select', label: 'Head Movement', options: 'headMovement' },
      { id: 'eyeMovement', type: 'select', label: 'Eye Movement', options: 'eyeMovement' },
      { id: 'motionIntensity', type: 'select', label: 'Lip Sync Intensity', options: 'motionIntensity' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' }
    ],
    promptTemplate: 'Animate character speaking:\n\nDialogue: "{dialogue}"\n\nSpeaking Style: {speakingStyle}\nExpression: {expression}\nHead Movement: {headMovement}\nEye Movement: {eyeMovement}\nLip Sync: {motionIntensity}\nDuration: {duration}\n\nNatural talking animation, realistic lip sync'
  },

  '11': { // Action Sequence
    name: 'Action Sequence',
    inputs: [
      { id: 'description', type: 'textarea', label: 'Action Description', placeholder: 'A martial artist performs a spinning kick...', rows: 4 },
      { id: 'actionType', type: 'select', label: 'Action Type', options: 'actionType' },
      { id: 'motionIntensity', type: 'select', label: 'Intensity', options: 'motionIntensity' },
      { id: 'speed', type: 'select', label: 'Speed', options: 'speed' },
      { id: 'camera', type: 'select', label: 'Camera Style', options: 'camera' },
      { id: 'lighting', type: 'select', label: 'Lighting', options: 'lighting' },
      { id: 'style', type: 'select', label: 'Visual Style', options: 'styles' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' },
      { id: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: 'aspectRatio' }
    ],
    promptTemplate: '{actionType}:\n\n{description}\n\nIntensity: {motionIntensity}\nSpeed: {speed}\nCamera: {camera}\nLighting: {lighting}\n\n{style} style, {duration}, {aspectRatio}, dynamic action, debris and effects, cinematic'
  },
  
  '12': { // Video Extender
    name: 'Video Extender',
    inputs: [
      { id: 'originalDesc', type: 'textarea', label: 'Original Scene Description', placeholder: 'Describe the original video scene...', rows: 3 },
      { id: 'continuation', type: 'textarea', label: 'What Happens Next', placeholder: 'She continues walking, then stops and turns...', rows: 3 },
      { id: 'camera', type: 'select', label: 'Camera Behavior', options: 'camera' },
      { id: 'speed', type: 'select', label: 'Pacing', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Extension Length', options: 'duration' }
    ],
    promptTemplate: 'Extend this video scene:\n\nOriginal: {originalDesc}\n\nContinuation: {continuation}\n\nCamera: {camera}\nPacing: {speed}\nExtension: {duration}\n\nSeamless continuation, match original style and lighting'
  },
  
  '13': { // Transition Maker
    name: 'Transition Maker',
    inputs: [
      { id: 'sceneA', type: 'textarea', label: 'Scene A (From)', placeholder: 'Close-up of eye with tear...', rows: 2 },
      { id: 'sceneB', type: 'textarea', label: 'Scene B (To)', placeholder: 'Wide shot of ocean waves...', rows: 2 },
      { id: 'transitionType', type: 'select', label: 'Transition Type', options: 'transitionType' },
      { id: 'mood', type: 'select', label: 'Transition Mood', options: 'mood' },
      { id: 'speed', type: 'select', label: 'Speed', options: 'speed' },
      { id: 'duration', type: 'select', label: 'Duration', options: 'duration' }
    ],
    promptTemplate: 'Create transition between scenes:\n\nScene A: {sceneA}\nScene B: {sceneB}\n\nTransition Type: {transitionType}\nMood: {mood}\nSpeed: {speed}\nDuration: {duration}\n\nSmooth creative transition, cinematic'
  },
  
  '14': { // Color Mood Matcher
    name: 'Color Mood Matcher',
    inputs: [
      { id: 'targetDesc', type: 'textarea', label: 'Image to Transform', placeholder: 'Describe the image you want to color match...', rows: 2 },
      { id: 'referenceDesc', type: 'textarea', label: 'Reference Look', placeholder: 'Describe the color/mood you want to match...', rows: 2 },
      { id: 'colorGrade', type: 'select', label: 'Target Color Grade', options: 'colorGrade' },
      { id: 'mood', type: 'select', label: 'Target Mood', options: 'mood' },
      { id: 'lighting', type: 'select', label: 'Lighting Style', options: 'lighting' }
    ],
    promptTemplate: 'Color match this image:\n\nTarget: {targetDesc}\nReference Look: {referenceDesc}\n\nColor Grade: {colorGrade}\nMood: {mood}\nLighting: {lighting}\n\nMatch colors and atmosphere while preserving content'
  },
  
  '15': { // Thumbnail Generator
    name: 'Thumbnail Generator',
    inputs: [
      { id: 'concept', type: 'textarea', label: 'Thumbnail Concept', placeholder: 'Shocked face reaction, bright colorful background...', rows: 3 },
      { id: 'expression', type: 'select', label: 'Expression (if face)', options: 'expression' },
      { id: 'colorPalette', type: 'select', label: 'Color Scheme', options: 'colorPalette' },
      { id: 'style', type: 'select', label: 'Style', options: 'styles' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' }
    ],
    promptTemplate: 'YouTube Thumbnail:\n\n{concept}\n\nExpression: {expression}\nColors: {colorPalette}\nStyle: {style}\nMood: {mood}\n\n16:9, eye-catching, high contrast, click-worthy thumbnail'
  },
  
  '16': { // Poster & Promo
    name: 'Poster & Promo',
    inputs: [
      { id: 'title', type: 'text', label: 'Project Title', placeholder: 'THE LAST DETECTIVE' },
      { id: 'tagline', type: 'text', label: 'Tagline (optional)', placeholder: 'Some secrets are worth dying for...' },
      { id: 'concept', type: 'textarea', label: 'Poster Concept', placeholder: 'A lone detective in rain, neon city behind...', rows: 4 },
      { id: 'posterStyle', type: 'select', label: 'Poster Style', options: 'posterStyle' },
      { id: 'posterComposition', type: 'select', label: 'Composition', options: 'posterComposition' },
      { id: 'colorPalette', type: 'select', label: 'Color Palette', options: 'colorPalette' },
      { id: 'mood', type: 'select', label: 'Mood', options: 'mood' }
    ],
    promptTemplate: 'Movie Poster: {title}\nTagline: {tagline}\n\n{concept}\n\nStyle: {posterStyle}\nComposition: {posterComposition}\nColors: {colorPalette}\nMood: {mood}\n\nProfessional movie poster, space for title at bottom, cinematic, highly detailed'
  }
};
