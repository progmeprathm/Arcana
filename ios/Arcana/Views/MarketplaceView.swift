import SwiftUI

public struct MarketplaceView: View {
    public let marketItems: [MarketItem]
    @Binding public var pantryItems: [PantryItem]
    public let onRestockItem: (MarketItem) -> Void

    public init(
        marketItems: [MarketItem],
        pantryItems: Binding<[PantryItem]>,
        onRestockItem: @escaping (MarketItem) -> Void
    ) {
        self.marketItems = marketItems
        self._pantryItems = pantryItems
        self.onRestockItem = onRestockItem
    }

    public var body: some View {
        NavigationView {
            ZStack {
                Color(red: 0.07, green: 0.07, blue: 0.09) // Obsidian 900
                    .ignoresSafeArea()

                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(marketItems) { item in
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text(item.name)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(Color(red: 0.96, green: 0.95, blue: 0.92))
                                    Spacer()
                                    Text(String(format: "$%.2f", item.unitPrice))
                                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                                        .foregroundColor(Color(red: 0.83, green: 0.69, blue: 0.22))
                                }

                                Text("\(item.provenance) • \(item.ethicalHarvestGrade.rawValue)")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(red: 0.46, green: 0.55, blue: 0.43))

                                Text(item.description)
                                    .font(.system(size: 11))
                                    .foregroundColor(.gray)

                                HStack {
                                    Spacer()
                                    Button(action: {
                                        onRestockItem(item)
                                    }) {
                                        HStack(spacing: 4) {
                                            Image(systemName: "bolt.fill")
                                            Text("Instant Restock (+\(Int(item.packageSize))\(item.unit))")
                                        }
                                        .font(.system(size: 11, weight: .bold))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(Color(red: 0.83, green: 0.69, blue: 0.22))
                                        .foregroundColor(.black)
                                        .cornerRadius(6)
                                    }
                                }
                            }
                            .padding(12)
                            .background(Color(red: 0.11, green: 0.11, blue: 0.13))
                            .cornerRadius(8)
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Marketplace")
        }
    }
}

