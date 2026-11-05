import SwiftUI

// Extension to detect shake gestures in SwiftUI
extension NSNotification.Name {
    public static let deviceDidShakeNotification = NSNotification.Name("DeviceDidShakeNotification")
}

#if canImport(UIKit)
import UIKit
extension UIWindow {
    open override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        super.motionEnded(motion, with: event)
        if motion == .motionShake {
            NotificationCenter.default.post(name: .deviceDidShakeNotification, object: nil)
        }
    }
}
#endif

@main
public struct ArcanaApp: App {
    @State private var isPanicActive = false
    @State private var pantryItems: [PantryItem] = [
        PantryItem(
            userId: "usr-rowan",
            name: "Mugwort (Artemisia vulgaris)",
            category: .flora,
            quantity: 45.0,
            unit: "g",
            lunarPhase: "Waxing Gibbous",
            minThreshold: 15.0,
            notes: "Wild harvested under waxing gibbous"
        ),
        PantryItem(
            userId: "usr-rowan",
            name: "Frankincense Resin Tears",
            category: .flora,
            quantity: 8.0,
            unit: "g",
            minThreshold: 10.0,
            notes: "Low stock alert"
        )
    ]

    public init() {}

    public var body: some Scene {
        WindowGroup {
            ZStack {
                if isPanicActive {
                    DiscretionCamouflageView {
                        isPanicActive = false
                    }
                } else {
                    TabView {
                        PantryView(items: $pantryItems)
                            .tabItem {
                                Label("Pantry", systemImage: "shippingbox.fill")
                            }

                        // Archive, Chronicle, Coven, Sanctum tab placeholders
                        Text("Archive Library")
                            .tabItem {
                                Label("Archive", systemImage: "book.fill")
                            }

                        Text("Chronicle Journal")
                            .tabItem {
                                Label("Chronicle", systemImage: "pencil.and.outline")
                            }

                        Text("Coven Portal")
                            .tabItem {
                                Label("Coven", systemImage: "person.3.fill")
                            }

                        VStack(spacing: 20) {
                            Text("Sanctum Profile")
                            Button("Trigger Discretion Mode") {
                                isPanicActive = true
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(.red)
                        }
                        .tabItem {
                            Label("Sanctum", systemImage: "shield.fill")
                        }
                    }
                    .accentColor(Color(red: 0.83, green: 0.69, blue: 0.22)) // Gold 500
                }
            }
            .onReceive(NotificationCenter.default.publisher(for: .deviceDidShakeNotification)) { _ in
                // Shake detected -> Instant camouflage switch (<100ms)
                isPanicActive = true
            }
        }
    }
}
