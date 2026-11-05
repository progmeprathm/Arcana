import SwiftUI
import PhotosUI

public struct ChronicleView: View {
    @Binding public var entries: [JournalEntry]
    @State private var selectedPhotoItem: PhotosPickerItem? = nil
    @State private var selectedImageData: Data? = nil
    @State private var isOcrProcessing = false
    @State private var ocrConfidence: Double = 94.6

    public init(entries: Binding<[JournalEntry]>) {
        self._entries = entries
    }

    public var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.07, green: 0.07, blue: 0.09) // Obsidian 900
                    .ignoresSafeArea()

                VStack(alignment: .leading, spacing: 14) {
                    // OCR Scanning Banner if image selected
                    if isOcrProcessing {
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("VISION OCR TRANSCRIPTION ACTIVE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22))
                                Spacer()
                                Text(String(format: "%.1f%% Match", ocrConfidence))
                                    .font(.system(size: 10, design: .monospaced))
                                    .foregroundColor(.green)
                            }
                            Text("Binarizing parchment background and parsing handwriting ligatures...")
                                .font(.system(size: 11))
                                .foregroundColor(.secondary)

                            Button("Inscribe Transcribed Note") {
                                isOcrProcessing = false
                            }
                            .font(.system(size: 11, weight: .semibold))
                            .padding(.vertical, 4)
                            .padding(.horizontal, 10)
                            .background(Color(red: 0.83, green: 0.69, blue: 0.22))
                            .foregroundColor(.black)
                            .cornerRadius(6)
                        }
                        .padding()
                        .background(Color(red: 0.11, green: 0.11, blue: 0.13))
                        .cornerRadius(8)
                        .padding(.horizontal)
                    }

                    // Entries List
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(entries) { entry in
                                chronicleCard(entry: entry)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .navigationTitle("Chronicle")
            .toolbar {
                ToolbarItemGroup(placement: .primaryAction) {
                    // PhotosPicker for Gallery upload
                    PhotosPicker(
                        selection: $selectedPhotoItem,
                        matching: .images,
                        photoLibrary: .shared()
                    ) {
                        Image(systemName: "photo.on.rectangle.angled")
                            .foregroundColor(Color(red: 0.46, green: 0.55, blue: 0.43))
                    }
                    .onChange(of: selectedPhotoItem) { newItem in
                        Task {
                            if let data = try? await newItem?.loadTransferable(type: Data.self) {
                                selectedImageData = data
                                isOcrProcessing = true
                            }
                        }
                    }

                    // Direct Camera trigger
                    Button(action: {
                        isOcrProcessing = true
                    }) {
                        Image(systemName: "camera.fill")
                            .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22))
                    }
                }
            }
        }
    }

    private func chronicleCard(entry: JournalEntry) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(entry.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(red: 0.96, green: 0.95, blue: 0.92))
                Spacer()
                HStack(spacing: 2) {
                    ForEach(0..<entry.outcomeRating, id: \.self) { _ in
                        Image(systemName: "star.fill")
                            .font(.system(size: 9))
                            .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22))
                    }
                }
            }

            Text(entry.formattedBody)
                .font(.system(size: 11))
                .foregroundColor(Color.gray)
                .lineLimit(3)

            if let ocr = entry.rawOcrText {
                Text("OCR: \(ocr)")
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22).opacity(0.8))
                    .lineLimit(1)
            }
        }
        .padding(12)
        .background(Color(red: 0.11, green: 0.11, blue: 0.13))
        .cornerRadius(8)
    }
}
