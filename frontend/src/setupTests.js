import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Fix for react-router-dom v7 in Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;