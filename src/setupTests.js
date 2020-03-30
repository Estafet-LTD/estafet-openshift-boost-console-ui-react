import 'jest-styled-components';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Set process environment variable for the test mode
process.env.NODE_ENV = 'test';

// Set other global variables used in the code
global.GATEWAY_API_SERVICE_URI = 'http://test.api';

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
