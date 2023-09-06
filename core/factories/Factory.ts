export default interface Factory {
  config?: Record<string, unknown>;
  definition(): Record<string, any>;
}