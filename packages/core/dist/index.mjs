// src/types/user-profile.ts
function hasPermission(profile, permission) {
  return profile.access.is_super_admin || profile.access.permissions.includes(permission);
}
function isProducer(profile) {
  return profile.access.is_producer;
}
function isSuperAdmin(profile) {
  return profile.access.is_super_admin;
}
export {
  hasPermission,
  isProducer,
  isSuperAdmin
};
//# sourceMappingURL=index.mjs.map