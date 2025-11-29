/**
 * @typedef {Object} UserData
 * @property {string} uid
 * @property {string} username (RNF1: < 12 caracteres)
 * @property {string} name
 * @property {string} bio
 *
 * @property {string} profileImageUrl
 */

/**
 * @typedef {Object} PostData
 * @property {string} postId
 * @property {string} userId
 * @property {string[]} imageUrls (RNF2: Array de URLs, max 6)
 * @property {number} likeCount (RNF5)
 * @property {Date} timestamp
 */


// --- UTILS DE VALIDAÇÃO DE MODELO (RNF1) ---

/**
 * Valida se o username atende ao RNF1 (máx. 12 caracteres, alfanumérico e underscore).
 * @param {string} username 
 * @returns {boolean}
 */
export const validateUsername = (username) => {
    // Regex: Apenas letras, números e underscore.
    return username && username.length > 0 && username.length <= 12 && /^[a-zA-Z0-9_]+$/.test(username);
};