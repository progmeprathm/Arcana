import SwiftUI

public struct PantryView: View {
    @Binding public var items: [PantryItem]
    @State private var selectedCategory: PantryCategory? = nil

    public init(items: Binding<[PantryItem]>) {
        self._items = items
    }

    private var filteredItems: [PantryItem] {
        if let cat = selectedCategory {
            return items.filter { $0.category == cat }
        }
        return items
    }

    public var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.07, green: 0.07, blue: 0.09) // Obsidian 900
                    .ignoresSafeArea()

                VStack(alignment: .leading, spacing: 12) {
                    // Category Picker
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            categoryButton(title: "All", isSelected: selectedCategory == nil) {
                                selectedCategory = nil
                            }
                            ForEach(PantryCategory.allCases, id: \.self) { cat in
                                categoryButton(title: cat.rawValue, isSelected: selectedCategory == cat) {
                                    selectedCategory = cat
                                }
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Item Cards
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(filteredItems) { item in
                                pantryItemRow(item: item)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .navigationTitle("Pantry Reserves")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: {}) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22)) // Gold 500
                    }
                }
            }
        }
    }

    private func categoryButton(title: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color(red: 0.37, green: 0.44, blue: 0.35) : Color(red: 0.11, green: 0.11, blue: 0.13))
                .foregroundColor(.white)
                .cornerRadius(6)
        }
    }

    private func pantryItemRow(item: PantryItem) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(item.category.rawValue.uppercased())
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(red: 0.46, green: 0.55, blue: 0.43))

                Spacer()

                if item.isLowStock {
                    Text("LOW STOCK")
                        .font(.system(size: 9, weight: .bold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.orange.opacity(0.2))
                        .foregroundColor(.orange)
                        .cornerRadius(4)
                }
            }

            Text(item.name)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(Color(red: 0.96, green: 0.95, blue: 0.92))

            if !item.notes.isEmpty {
                Text("\"\(item.notes)\"")
                    .font(.system(size: 11))
                    .foregroundColor(.gray)
            }

            HStack {
                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text(String(format: "%.1f", item.quantity))
                        .font(.system(size: 17, weight: .bold, design: .monospaced))
                        .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22))
                    Text(item.unit)
                        .font(.system(size: 11))
                        .foregroundColor(.gray)
                }

                Spacer()

                if let phase = item.lunarPhase {
                    Text(phase)
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(12)
        .background(Color(red: 0.11, green: 0.11, blue: 0.13))
        .cornerRadius(8)
    }
}
