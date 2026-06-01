class DomainError(Exception):
    """Raised when inputs are valid types but semantically/physically impossible,
    or an explicitly requested method's required inputs are missing."""
