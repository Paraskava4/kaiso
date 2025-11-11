export default {
  // Main container styles
  main: "flex flex-col gap-5 items-start p-5 mx-auto my-0 w-full bg-white max-w-[1660px] max-md:p-4 max-md:max-w-[991px] max-sm:p-3 max-sm:max-w-screen-sm",
  section: "flex flex-col gap-5 items-start w-full",

  // Header styles
  header: "flex justify-between items-center w-full max-md:flex-col max-md:gap-4",
  headerTitle: "text-base font-bold leading-6 text-black max-sm:text-sm",
  headerActions: "flex gap-2.5 items-center max-md:flex-wrap max-md:justify-center max-sm:flex-col max-sm:gap-2 max-sm:w-full",

  // Button styles
  darkModeButton: "flex gap-2.5 justify-center items-center px-5 py-1.5 bg-white rounded-md border border-solid border-zinc-700 border-opacity-30 max-sm:justify-center max-sm:w-full",
  saveButton: "gap-2.5 px-5 py-1.5 text-base leading-5 text-center text-white bg-sky-900 rounded-md max-sm:w-full max-sm:text-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
  cancelButton: "gap-2.5 px-5 py-1.5 text-base leading-5 text-center bg-white rounded-md border border-solid border-zinc-700 border-opacity-30 text-zinc-700 max-sm:w-full max-sm:text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1",

  // Form styles
  form: "flex flex-col gap-2.5 items-start w-full",
  formRow: "flex gap-2.5 items-end w-full max-md:flex-col max-md:gap-4",

  // Field styles
  fieldLabel: "w-full text-base leading-6 text-zinc-500 max-sm:text-sm",

  // Upload field styles
  uploadField: "flex flex-col gap-2 justify-center items-center flex-[1_0_0] max-md:w-full",
  uploadContainer: "flex gap-2.5 justify-center items-center px-5 py-3 w-full bg-white rounded-md border-solid border-[0.5px] border-zinc-700 border-opacity-30",
  fileInput: "sr-only",
  uploadLabel: "text-base leading-6 text-center flex-[1_0_0] text-zinc-500 max-sm:text-sm cursor-pointer flex items-center justify-between w-full",
  uploadIcon: "text-zinc-500 w-5 h-5",
  checkIcon: "text-green-500 w-5 h-5",
  previewContainer: "mt-2 w-full h-20 bg-gray-100 rounded-md overflow-hidden",
  previewImage: "w-full h-full object-contain",

  // Text input styles
  inputField: "flex flex-col gap-2 justify-center items-center flex-[1_0_0] max-md:w-full",
  textInput: "gap-2.5 px-5 py-3 w-full text-base leading-6 text-center bg-white rounded-md border-solid border-[0.5px] border-zinc-700 border-opacity-30 flex-[1_0_0] text-zinc-500 max-sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",

  // Dropdown styles
  dropdownField: "flex flex-col gap-2 justify-center items-center flex-[1_0_0] max-md:w-full",
  dropdownContainer: "flex gap-2.5 justify-center items-center px-5 py-3 w-full bg-white rounded-md border-solid border-[0.5px] border-zinc-700 border-opacity-30",
  dropdownSelect: "text-base leading-6 text-center flex-[1_0_0] text-zinc-500 max-sm:text-sm bg-transparent border-none outline-none appearance-none cursor-pointer ",
  dropdownArrow: "text-zinc-500 w-5 h-5",
  dropdownIcon: "w-4 h-4",

  // // Preview section styles
  previewSection: "w-full ",
  previewTitle: "w-full text-base font-bold leading-6 text-black max-sm:text-sm mb-4",
  previewContent: "relative p-8 rounded-lg bg-gray-100",
  darkPreview: "bg-gray-900 text-white",
  previewBgImage: "absolute inset-0 w-full h-[640px] object-cover",
  previewInnerContent: "relative z-10 flex flex-col items-center justify-center text-center space-y-4",
  previewIcon: "w-16 h-16 object-contain",
  previewTitleText: "text-2xl font-bold text-white",
  previewHeadline: "text-4xl font-bold text-white",
  previewSubline: "text-xl text-white",
  previewButtons: "flex gap-4",

  // Button preview styles
  primaryButtonLight: "px-6 py-3 rounded-md font-medium bg-[#D5003C] text-white",
  secondaryButtonLight: "px-6 py-3 rounded-md font-medium bg-white text-black",
  outlineButtonLight: "px-6 py-3 rounded-md font-medium bg-transparent text-white",
  primaryButton: "px-6 py-3 rounded-md font-medium bg-[#D5003C] text-white",
  secondaryButton: "px-6 py-3 rounded-md font-medium bg-black text-white",
  outlineButton: "px-6 py-3 rounded-md font-medium bg-transparent text-black border border-black",


  // Placeholder styles
  placeholderBgImage: "absolute inset-0 w-full h-full bg-gray-200",
  placeholderIcon: "w-16 h-16 rounded bg-gray-300 flex items-center justify-center",
  placeholderText: "text-gray-400 italic",
  previewPlaceholder: "flex items-center justify-center text-sm text-gray-400 italic w-full h-20 bg-gray-200 rounded-md",
  placeholderButton: "px-6 py-3 rounded-md font-medium bg-gray-300 text-gray-500 cursor-default",
};