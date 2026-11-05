import SwiftUI

public struct DiscretionCamouflageView: View {
    public let onUnlock: () -> Void

    @State private var showPinSheet = false
    @State private var pinCode = ""
    @State private var hasError = false

    public init(onUnlock: @escaping () -> Void) {
        self.onUnlock = onUnlock
    }

    public var body: some View {
        ZStack {
            Color(red: 0.97, green: 0.98, blue: 0.99)
                .ignoresSafeArea()
                .onTapGesture(count: 2) {
                    showPinSheet = true
                }

            VStack(alignment: .leading, spacing: 16) {
                // Enterprise Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("NovaLogix Mobile v4.8")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(red: 0.12, green: 0.16, blue: 0.23))
                        Text("Sector 04 Logistics Reconciliation")
                            .font(.system(size: 11))
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                    Button("Unlock") {
                        showPinSheet = true
                    }
                    .font(.system(size: 12))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.white)
                    .cornerRadius(6)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(Color.gray.opacity(0.3), lineWidth: 1))
                }

                Divider()

                // Data Table
                VStack(spacing: 8) {
                    ledgerRow(sku: "NLX-9941-A", desc: "Cellulose Binder v2", qty: "45.0 kg", status: "Optimal")
                    Divider()
                    ledgerRow(sku: "NLX-4420-C", desc: "Oleoresin Compound", qty: "8.0 kg", status: "Reorder Alert")
                    Divider()
                    ledgerRow(sku: "NLX-1029-M", desc: "Silica Granulate", qty: "4 units", status: "Optimal")
                    Divider()
                    ledgerRow(sku: "NLX-8802-T", desc: "Ceramic Mortar Base", qty: "1 unit", status: "Stable")
                }
                .padding()
                .background(Color.white)
                .cornerRadius(8)
                .shadow(color: Color.black.opacity(0.04), radius: 3, x: 0, y: 1)

                Spacer()

                Text("Confidential Corporate Ledger • Double tap anywhere to authenticate")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding()
        }
        .sheet(isPresented: $showPinSheet) {
            VStack(spacing: 16) {
                Text("Security Authentication")
                    .font(.headline)
                Text("Enter passkey (Default: 1337):")
                    .font(.caption)
                    .foregroundColor(.secondary)

                SecureField("Passkey", text: $pinCode)
                    .textFieldStyle(.roundedBorder)
                    .frame(width: 140)
                    .multilineTextAlignment(.center)

                if hasError {
                    Text("Invalid security code")
                        .font(.caption2)
                        .foregroundColor(.red)
                }

                HStack(spacing: 12) {
                    Button("Cancel") {
                        showPinSheet = false
                    }
                    Button("Unlock") {
                        if pinCode == "1337" || pinCode == "0000" {
                            showPinSheet = false
                            onUnlock()
                        } else {
                            hasError = true
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            .padding()
            .presentationDetents([.height(220)])
        }
    }

    private func ledgerRow(sku: String, desc: String, qty: String, status: String) -> some View {
        HStack {
            Text(sku)
                .font(.system(size: 11, design: .monospaced))
                .foregroundColor(.secondary)
            Spacer()
            Text(desc)
                .font(.system(size: 12, weight: .medium))
            Spacer()
            Text(qty)
                .font(.system(size: 12, weight: .semibold))
        }
    }
}
