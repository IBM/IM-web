/**
* IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
*
* START
*/

import SdkConfig from "../SdkConfig";

export async function encryptWithPublicKey(recoveryKey: string, publicKeyPem: string): Promise<string> {
    const publicKeyBuffer = convertPemToArrayBuffer(publicKeyPem);
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        false,
        ["encrypt"]
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(recoveryKey);
    const encryptedData = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
    return arrayBufferToBase64(encryptedData);
}

export function convertPemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem.replace(/^-----BEGIN PUBLIC KEY-----/, "")
        .replace(/-----END PUBLIC KEY-----$/, "")
        .replace(/\n/g, "");
    const binaryDerString = atob(b64);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return binaryDer.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export async function saveRecoveryKey(recoveryKey: string, accessToken: string): Promise<boolean> {
    const KEY_BACKUP_URL = SdkConfig.get().key_backup_url;
    const publicKeyPem = process.env.PUBLIC_KEY || '';

    if (!publicKeyPem || !KEY_BACKUP_URL) {
        console.error("Missing config for public key or URL");
        return false;
    }

    try {
        const encryptedKey = await encryptWithPublicKey(recoveryKey, publicKeyPem);
        const response = await fetch(KEY_BACKUP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ recoveryKey: encryptedKey }),
        });
        return response.ok;
    } catch (err) {
        console.error("Failed to save recovery key:", err);
        return false;
    }
}

/**
 * END
 *
 * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
 */
